import { Component, OnInit, Input } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { addDays, addHours, startOfDay } from 'date-fns';
import { MatDialog } from '@angular/material';
import { ScheduleInputDialogComponent } from '../schedule-input-dialog/schedule-input-dialog.component';

import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { database } from 'src/environments/environment';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.less']
})
export class CalendarComponent implements OnInit {

  @Input() settings: any;

  viewDate: Date = new Date();

  events: CalendarEvent[];
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

  eventsDBColl: AngularFirestoreCollection<any>;

  constructor(public db: AngularFirestore, public dialog: MatDialog) {
    this.eventsDBColl = db.collection(database.schedulesCollection);

    this.eventsDBColl.valueChanges().subscribe( data => {
      console.log('Retreived from Firestore: ', data);
      this.events = data.map(e => {
        const event: CalendarEvent = {
          // id: e.id,
          start: new Date(e.from.seconds * 1000),
          end: new Date(e.to.seconds * 1000),
          title: '<b>'.concat(e.subject, '</b> ', e.teacher, ', ', e.room),
          color: colors.blue
        };
        return event;
      });
      console.log(this.events);
    });
  }

  ngOnInit() { }

  eventClicked({ event }: { event: CalendarEvent }): void {
    console.log('Event clicked:', event.title);
    // open Edit dialog
  }

  addEvent(eventItem): void {
    console.log(eventItem);
    // const dialogRef = this.dialog.open(ScheduleInputDialogComponent, {
    //   height: '500px',
    //   width: '600px',
    //   data: {
    //     settings: this.settings,
    //     editing: false
    //     entry: new ScheduleEntry(null, this.timeslot, null, this.batch, null, null)
    //   }
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     // this.saveSuccessEvent.emit();
    //   } else {
    //     console.log('Input dialog was closed without saving');
    //   }
    // });
  }

}
