import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-error-message-dialog',
  templateUrl: './error-message-dialog.component.html',
  styleUrls: ['./error-message-dialog.component.less']
})
export class ErrorMessageDialogComponent implements OnInit {

  header: string;
  errorMessage: string;

  constructor(public dialogRef: MatDialogRef<ErrorMessageDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.header = data.header;
    this.errorMessage = data.errorMessage;
  }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
