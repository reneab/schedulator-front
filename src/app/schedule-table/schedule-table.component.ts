import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ErrorMessageDialogComponent } from '../error-message-dialog/error-message-dialog.component';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { database } from 'src/environments/environment';
import { CalendarEvent } from 'angular-calendar';
import { EventColor } from 'calendar-utils';

const myColors = {
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
  },
  pink: {
    primary: '#f146db',
    secondary: '#ffdffb'
  },
  orange: {
    primary: '#f59a39',
    secondary: '#fbdcbb'
  },
  green: {
    primary: '#4ff739',
    secondary: '#dffddb'
  },
  purple: {
    primary: '#673AB7',
    secondary: '#d9c7f9'
  }
};

@Component({
  selector: 'app-schedule-table',
  templateUrl: './schedule-table.component.html',
  styleUrls: ['./schedule-table.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class ScheduleTableComponent implements OnInit {

  settingsColRef: AngularFirestoreCollection<any>;
  eventsColRef: AngularFirestoreCollection<any>;
  settings: any = { colors: {} };
  events: CalendarEvent[];

  constructor(public db: AngularFirestore, public dialog: MatDialog) {
    this.settingsColRef = db.collection(database.settingsCollection);
    this.eventsColRef = db.collection(database.schedulesCollection);
  }

  ngOnInit(): void {
    console.log('Loading settings...');
    this.settingsColRef.doc(database.settingsDocument).valueChanges().subscribe(doc => {
      this.settings = doc;
      console.log('Initialized with settings', this.settings);

      console.log('Loading schedule events...');
      this.eventsColRef.snapshotChanges().subscribe(items => {
        console.log('Retreived from Firestore: ', items);
        this.events = items.map(e => {
          // TODO: convert data to ScheduleEntry, and from there to calendar event using another function
          const data = e.payload.doc.data();
          const event: CalendarEvent = {
            start: new Date(data.from.seconds * 1000),
            end: new Date(data.to.seconds * 1000),
            title: `<b>[${data.batch}] ${data.subject}</b> ${data.teacher}, ${data.room}`,
            color: this.getColorForSubject(data.subject),
            meta: {
              id: e.payload.doc.id,
              batch: data.batch,
              teacher: data.teacher,
              subject: data.subject,
              room: data.room,
              recurring: data.recurring
            }
          };
          console.log('Loaded event:', event);
          return event;
        });
      });
    });
  }

  openErrorDialog(message: string): void {
    this.dialog.open(ErrorMessageDialogComponent, {
      height: '180px',
      width: '350px',
      data: { errorMessage: message }
    });
  }

  getColorForSubject(subject: string): EventColor {
    if (!this.settings.colors || Object.keys(this.settings.colors).length == 0) {
      return myColors.blue; // default
    } else {
      for (const color in this.settings.colors) {
        // look for one entry in settings.colors that is contained in the subject title
        if (this.settings.colors[color].find(str => subject.toLowerCase().indexOf(str) >= 0)) {
          return myColors[color];
        }
      }
      return myColors.blue; // default
    }
  }
}
