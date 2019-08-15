import { Component, OnInit, Input } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { format, addDays, addHours, startOfDay } from 'date-fns';
import { MatDialog } from '@angular/material';
import { ScheduleInputDialogComponent } from '../schedule-input-dialog/schedule-input-dialog.component';

import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { database } from 'src/environments/environment';
import { ScheduleEntry } from '../ScheduleEntry';

const colors = [
  { // red
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  { // blue
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  { // yellow
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
];

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.less']
})
export class CalendarComponent implements OnInit {

  @Input() settings: any;

  viewDate: Date = new Date();

  allEvents: CalendarEvent[];
  filteredEvents: CalendarEvent[];
  // = [
  //    {
  //     start: addHours(startOfDay(new Date()), 8),
  //     end: addHours(startOfDay(addDays(new Date(), 1)), 10),
  //     title: '<b>Web</b>, Ean Velayo, LB442',
  //     color: colors.blue,
  //     resizable: {
  //       beforeStart: false,
  //       afterEnd: true
  //     },
  //     draggable: true
  //   },
  // ];

  collRef: AngularFirestoreCollection<any>;

  constructor(public db: AngularFirestore, public dialog: MatDialog) {
    this.collRef = db.collection(database.schedulesCollection);
  }

  ngOnInit() {
    this.collRef.snapshotChanges().subscribe( items => {
      console.log('Retreived from Firestore: ', items);
      let counter = 0; // just for coloring TODO: find a better solution
      this.allEvents = items.map(e => {
        // TODO: convert data to ScheduleEntry, and from there to calendar event using another function
        const data = e.payload.doc.data();
        const event: CalendarEvent = {
          start: new Date(data.from.seconds * 1000),
          end: new Date(data.to.seconds * 1000),
          title: '<b>'.concat(data.subject, '</b> ', data.teacher, ', ', data.room),
          color: colors[counter % 3],
          meta: {
            id: e.payload.doc.id,
            batch: data.batch,
            teacher: data.teacher,
            subject: data.subject,
            room: data.room
          }
        };
        counter++;
        console.log('Loaded event:', event);
        return event;
      });
      this.filteredEvents = this.allEvents;
    });
  }

  onChangeToggle(event): void {
    console.log('Changed batch filter to: ' + event.value);
    this.filteredEvents = this.allEvents.filter(i => i.meta.batch === event.value);
  }

  // util function
  openScheduleInputDialog(editingMode: boolean, day: Date, data: ScheduleEntry): void {
    const dialogRef = this.dialog.open(ScheduleInputDialogComponent, {
      height: '550px',
      width: '500px',
      data: {
        settings: this.settings,
        editing: editingMode,
        day: startOfDay(day),
        entry: data
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
      } else {
        console.log('Input dialog was closed without saving');
      }
    });
  }

  addEvent(time): void {
    const startDate: Date = new Date(time);
    console.log('Adding event on ', startDate);
    this.openScheduleInputDialog(false, startDate, new ScheduleEntry(startDate, addHours(startDate, 1),
      this.settings.teachers[0], this.settings.batches[0], this.settings.rooms[0], null),
    );
  }

  modifyEvent({ event }: { event: CalendarEvent }): void {
    console.log('Modifying event with ID: ', event.meta.id);
    this.openScheduleInputDialog(true, event.start, new ScheduleEntry(event.start, event.end,
      event.meta.teacher, event.meta.batch, event.meta.room, event.meta.subject, event.meta.id),
    );
  }
}
