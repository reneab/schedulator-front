import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-schedule-input-dialog',
  templateUrl: './schedule-input-dialog.component.html',
  styleUrls: ['./schedule-input-dialog.component.less']
})
export class ScheduleInputDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ScheduleInputDialogComponent>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

}
