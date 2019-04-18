import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {MAT_DIALOG_DATA} from '@angular/material';
import { DataService } from '../data.service';
import { ScheduleEntry } from '../ScheduleEntry';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-schedule-input-dialog',
  templateUrl: './schedule-input-dialog.component.html',
  styleUrls: ['./schedule-input-dialog.component.less']
})
export class ScheduleInputDialogComponent implements OnInit {

  editingMode: boolean;
  scheduleForm: FormGroup;
  settings: any;
  entry: ScheduleEntry;
  errorMessage: string;

  constructor(public dialogRef: MatDialogRef<ScheduleInputDialogComponent>,
              private dataService: DataService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.settings = data.settings;
    this.editingMode = data.editing;
    this.entry = data.entry;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.scheduleForm = new FormGroup({
      time: new FormControl({value: this.entry.time, disabled: !this.editingMode}, Validators.required),
      batch: new FormControl({value: this.entry.batch, disabled: !this.editingMode}, Validators.required),
      teacher: new FormControl(this.entry.teacher || this.settings.teachers[0], Validators.required),
      room: new FormControl(this.entry.room || this.settings.rooms[0], Validators.required),
      subject: new FormControl(this.entry.subject, Validators.required)
    });
  }

  save = function(element) {
    console.log('Saving ' + JSON.stringify(element));
    if (this.editingMode) {
      this.handleBackEndRequest(this.dataService.saveScheduleElement(element, this.entry.id));
    } else {
      this.handleBackEndRequest(this.dataService.saveScheduleElement(element));
    }
  };

  delete = function() {
    console.log('Deleting entry with ID: ' + this.entry.id);
    this.handleBackEndRequest(this.dataService.deleteScheduleElement(this.entry.id));
  };

  private handleBackEndRequest = function(obs: Observable<string>) {
    obs.subscribe(res => {
      console.log(res);
      this.dialogRef.close(true);
    }, error => {
      const message = error._body;
      console.log(message);
      this.errorMessage = message;
    });
  };

}
