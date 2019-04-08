import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {MAT_DIALOG_DATA} from '@angular/material';
import { DataService } from '../data.service';

@Component({
  selector: 'app-schedule-input-dialog',
  templateUrl: './schedule-input-dialog.component.html',
  styleUrls: ['./schedule-input-dialog.component.less']
})
export class ScheduleInputDialogComponent implements OnInit {

  scheduleForm: FormGroup;
  settings: any;
  timeslot: string;
  errorMessage: string;
  saved = false;

  constructor(public dialogRef: MatDialogRef<ScheduleInputDialogComponent>,
              private dataService: DataService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.settings = data.settings;
    this.timeslot = data.timeslot;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.scheduleForm = new FormGroup({
      time: new FormControl({value: this.timeslot, disabled: true}, Validators.required),
      batch: new FormControl(this.settings.batches[0]),
      teacher: new FormControl(this.settings.teachers[0]),
      room: new FormControl(this.settings.rooms[0]),
      subject: new FormControl('', Validators.required)
    });
  }

  onSave = function(element) {
    console.log('Saving ' + JSON.stringify(element));
    this.dataService.saveScheduleElement(element).subscribe(res => {
      console.log(res);
      this.saved = true;
      this.dialogRef.close(true);
    }, error => {
      this.saved = false;
      this.errorMessage = error._body;
    });
  };

}
