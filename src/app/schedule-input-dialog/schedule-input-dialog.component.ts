import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {MAT_DIALOG_DATA} from '@angular/material';
import { ScheduleEntry } from '../ScheduleEntry';
import { format, addHours, addMinutes, isBefore, isAfter, startOfDay, isEqual } from 'date-fns';
import { CalendarEvent } from 'calendar-utils';
import { ScheduleFirestoreService } from '../schedule-firestore.service';
import { ScheduleUtilService } from '../schedule-util.service';

@Component({
  selector: 'app-schedule-input-dialog',
  templateUrl: './schedule-input-dialog.component.html',
  styleUrls: ['./schedule-input-dialog.component.less']
})
export class ScheduleInputDialogComponent implements OnInit {

  editingMode: boolean; // creation of new entry or editing existing
  scheduleForm: FormGroup;
  settings: any; // needed for the dropdown menus in the form
  events: CalendarEvent[]; // needed for the dropdown menus in the form
  entry: ScheduleEntry; // a schedule entry to pre-fill the form
  day: Date; // the day where the new event should be. Because it' not asked in the form

  errorMessage: string;

  constructor(public dialogRef: MatDialogRef<ScheduleInputDialogComponent>,
              public scheduleFsService: ScheduleFirestoreService,
              public scheduleUtil: ScheduleUtilService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
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
      from: new FormControl(format(new Date(this.entry.from), 'HH:mm'), Validators.required),
      to: new FormControl(format(new Date(this.entry.to), 'HH:mm'), Validators.required),
      batch: new FormControl(this.entry.batch || this.settings.batches[0], Validators.required),
      subject: new FormControl(this.entry.subject, Validators.required),
      room: new FormControl(this.entry.room || this.settings.rooms[0], Validators.required),
      teacher: new FormControl(this.entry.teacher),
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

  save(element) {
    console.log('Saving ' + JSON.stringify(element));
    element.from = this.convertTimeInputToDate(element.from);
    element.to = this.convertTimeInputToDate(element.to);
    if (isBefore(element.to, element.from)) {
      this.errorMessage = 'End time is before start time!';
      this.scheduleForm.controls.to.setErrors({ 'before start date': true });
    } else {
      // checking for schedules conflicts first
      const scheduleEntry = new ScheduleEntry(element.from, element.to, element.teacher, element.batch, element.room, element.subject,
        element.recurring, this.entry.id);
      const conflictError = this.scheduleUtil.getConflictError(scheduleEntry, this.events);
      if (conflictError) {
        this.errorMessage = conflictError.message;
        this.scheduleForm.controls[conflictError.fieldInError].markAsTouched();
        this.scheduleForm.controls[conflictError.fieldInError].setErrors({taken: true});
      } else {
        console.log('No conflict found. Updating database...');
        // save new or update existing
        (this.editingMode ? this.scheduleFsService.updateScheduleEvent(this.entry.id, element) :
          this.scheduleFsService.createScheduleEvent(element))
          .then(res => {
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
    this.scheduleFsService.deleteScheduleEvent(this.entry.id)
      .then(res => {
        this.dialogRef.close(true);
      }).catch(error => {
        const message = error._body;
        console.log(message);
        this.errorMessage = message;
      });
  }

}
