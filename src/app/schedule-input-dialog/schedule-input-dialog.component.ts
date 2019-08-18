import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {MAT_DIALOG_DATA} from '@angular/material';
import { ScheduleEntry } from '../ScheduleEntry';
import { format, addHours, addMinutes, isBefore, isAfter } from 'date-fns';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { database } from 'src/environments/environment';
import { CalendarEvent } from 'calendar-utils';

@Component({
  selector: 'app-schedule-input-dialog',
  templateUrl: './schedule-input-dialog.component.html',
  styleUrls: ['./schedule-input-dialog.component.less']
})
export class ScheduleInputDialogComponent implements OnInit {

  eventsDBColl: AngularFirestoreCollection<any>;

  editingMode: boolean; // creation of new entry or editing existing
  scheduleForm: FormGroup;
  settings: any; // needed for the dropdown menus in the form
  events: CalendarEvent[]; // needed for the dropdown menus in the form
  entry: ScheduleEntry; // a schedule entry to pre-fill the form
  day: Date; // the day where the new event should be. Because it' not asked in the form

  errorMessage: string;

  constructor(public dialogRef: MatDialogRef<ScheduleInputDialogComponent>,
              public db: AngularFirestore,
              @Inject(MAT_DIALOG_DATA) public data: any) {
                this.eventsDBColl = db.collection(database.schedulesCollection);
                this.settings = data.settings;
                this.events = data.events;
                this.editingMode = data.editing;
                this.entry = data.entry;
                this.day = data.day;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.scheduleForm = new FormGroup({
      from: new FormControl({value: format(new Date(this.entry.from), 'HH:mm'), disabled: !this.editingMode}, Validators.required),
      to: new FormControl(format(new Date(this.entry.to), 'HH:mm'), Validators.required),
      batch: new FormControl(this.entry.batch || this.settings.batches[0], Validators.required),
      teacher: new FormControl(this.entry.teacher || this.settings.teachers[0], Validators.required),
      room: new FormControl(this.entry.room || this.settings.rooms[0], Validators.required),
      subject: new FormControl(this.entry.subject, Validators.required)
    });
  }

  // converts the form output (string) to a date
  convertTimeInputToDate(time: string): Date {
    const h: number = parseInt(time.split(':')[0], 0);
    const m: number = parseInt(time.split(':')[1], 0);
    const d: Date = addMinutes(addHours(this.day, h), m);
    return d;
  }

  checkForConflict(element: any): string {
    let conflict: string;
    this.events.forEach(e => {
      // FIXME: doesn't work when the end and start are exactly the same
      // TODO: add a check on the event ID that it is different (for updates)
      if (isAfter(element.from, e.start) && isBefore(element.from, e.end) ||
        isAfter(element.to, e.start) && isBefore(element.to, e.end)) {
          if (element.batch === e.meta.batch) {
            conflict = element.batch;
          }
          if (element.room === e.meta.room) {
            conflict = element.room;
          }
          if (element.teacher === e.meta.teacher) {
            conflict = element.teacher;
          }
      }
    });
    return conflict;
  }

  save(element) {
    console.log('Saving ' + JSON.stringify(element));
    element.from = this.convertTimeInputToDate(element.from);
    element.to = this.convertTimeInputToDate(element.to);
    // checking for schedules conflicts first
    const conflict: string = this.checkForConflict(element);
    if (conflict) {
      console.warn('Schedule conflict for', conflict);
      this.errorMessage = conflict + ' is already taken';
    } else {
      console.log('No conflict found. Updating database...');
      // save new or update existing
      const exec: Promise<any> = this.editingMode ? this.eventsDBColl.doc(this.entry.id).update(element) : this.eventsDBColl.add(element);
      exec.then(res => {
        this.dialogRef.close(true);
      }).catch(error => {
        const message = error._body;
        console.log(message);
        this.errorMessage = message;
      });
    }
  }

  delete() {
    console.log('Deleting entry with ID: ' + this.entry.id);
    this.eventsDBColl.doc(this.entry.id).delete()
      .then(res => {
        this.dialogRef.close(true);
      }).catch(error => {
        const message = error._body;
        console.log(message);
        this.errorMessage = message;
      });
  }

}
