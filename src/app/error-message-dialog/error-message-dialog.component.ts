import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-error-message-dialog',
  templateUrl: './error-message-dialog.component.html',
  styleUrls: ['./error-message-dialog.component.less']
})
export class ErrorMessageDialogComponent implements OnInit {

  message: string;

  constructor(public dialogRef: MatDialogRef<ErrorMessageDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.message = data.errorMessage;
  }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
