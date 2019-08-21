import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {MAT_DIALOG_DATA} from '@angular/material';
import { ScheduleEntry } from '../ScheduleEntry';
import { format, addHours, addMinutes, isBefore, isAfter, startOfDay, isEqual } from 'date-fns';
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
      subject: new FormControl(this.entry.subject, Validators.required),
      recurring: new FormControl(this.entry.recurring)
    });
  }

  // converts the form output (string) to a date
  convertTimeInputToDate(time: string): Date {
    const h: number = parseInt(time.split(':')[0], 0);
    const m: number = parseInt(time.split(':')[1], 0);
    const d: Date = addMinutes(addHours(startOfDay(this.day), h), m);
    return d;
  }

  isInConflict(schedule: ScheduleEntry, event: CalendarEvent): boolean {
    const isTimeConflict: boolean =
      (isAfter(schedule.from, event.start) || isEqual(schedule.from, event.start)) && isBefore(schedule.from, event.end)
      || isAfter(schedule.to, event.start) && (isBefore(schedule.to, event.end) || isEqual(schedule.to, event.end))
      || isBefore(schedule.from, event.start) && isAfter(schedule.to, event.end);
    return isTimeConflict && (schedule.batch === event.meta.batch || schedule.teacher === event.meta.teacher
      || schedule.room === event.meta.room);
  }

  returnFirstConflict(scheduleEntry: ScheduleEntry): CalendarEvent {
    return this.events.filter(e => e.meta.id !== this.entry.id) // need to not consider existing element (when updating)
      .find(e => this.isInConflict(scheduleEntry, e));
  }

  save(element) {
    console.log('Saving ' + JSON.stringify(element));
    element.from = this.convertTimeInputToDate(element.from);
    element.to = this.convertTimeInputToDate(element.to);
    const scheduleEntry = new ScheduleEntry(element.from, element.to, element.teacher, element.batch, element.room, element.subject,
      element.recurring);
    if (isBefore(scheduleEntry.to, scheduleEntry.from)) {
      this.errorMessage = 'End time is before start time!';
      this.scheduleForm.controls.to.setErrors({'before start date': true});
    } else {
      // checking for schedules conflicts first
      const conflict: CalendarEvent = this.returnFirstConflict(element);
      if (conflict) {
        console.warn('Conflict found for event with ID', conflict.meta.id);
        if (scheduleEntry.batch === conflict.meta.batch) {
          this.errorMessage = scheduleEntry.batch + ' is already busy';
          this.scheduleForm.controls.batch.markAsTouched();
          this.scheduleForm.controls.batch.setErrors({'already taken': true});
        } else if (scheduleEntry.teacher === conflict.meta.teacher) {
          this.errorMessage = scheduleEntry.teacher + ' is already busy';
          this.scheduleForm.controls.teacher.markAsTouched();
          this.scheduleForm.controls.teacher.setErrors({taken: true});
        } else if (scheduleEntry.room === conflict.meta.room) {
          this.errorMessage = scheduleEntry.room + ' is already taken';
          this.scheduleForm.controls.room.markAsTouched();
          this.scheduleForm.controls.room.setErrors({taken: true});
        }
        this.errorMessage += ' from ' + conflict.start.toLocaleTimeString() + ' to ' + conflict.end.toLocaleTimeString();
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
