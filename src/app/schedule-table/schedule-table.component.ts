import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ErrorMessageDialogComponent } from '../error-message-dialog/error-message-dialog.component';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { database } from 'src/environments/environment';
import { CalendarEvent } from 'angular-calendar';

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
  selector: 'app-schedule-table',
  templateUrl: './schedule-table.component.html',
  styleUrls: ['./schedule-table.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class ScheduleTableComponent implements OnInit {

  settingsColRef: AngularFirestoreCollection<any>;
  eventsColRef: AngularFirestoreCollection<any>;
  settings: any = {};
  events: CalendarEvent[];

  constructor(public db: AngularFirestore, public dialog: MatDialog) {
    this.settingsColRef = db.collection(database.settingsCollection);
    this.eventsColRef = db.collection(database.schedulesCollection);
  }

  ngOnInit(): void {
    console.log('Loading settings...');
    this.settingsColRef.doc(database.settingsDocument).valueChanges().subscribe( doc => {
      this.settings = doc;
      console.log('Initialized with settings', this.settings);
    });

    console.log('Loading schedule events...');
    this.eventsColRef.snapshotChanges().subscribe( items => {
      console.log('Retreived from Firestore: ', items);
      let counter = 0; // just for coloring TODO: find a better solution
      this.events = items.map(e => {
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
    });
  }

  openErrorDialog(message: string): void {
    this.dialog.open(ErrorMessageDialogComponent, {
      height: '180px',
      width: '350px',
      data: {errorMessage: message}
    });
  }

}
