import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DataService } from '../data.service';
import { MatDialog } from '@angular/material';
import { ErrorMessageDialogComponent } from '../error-message-dialog/error-message-dialog.component';
import { ScheduleEntry } from '../ScheduleEntry';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { SettingsComponent } from '../settings/settings.component';
import { database } from 'src/environments/environment';

@Component({
  selector: 'app-schedule-table',
  templateUrl: './schedule-table.component.html',
  styleUrls: ['./schedule-table.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class ScheduleTableComponent implements OnInit {

  settings: any = {};

  constructor(public db: AngularFirestore, public dialog: MatDialog) {
    console.log('Loading settings...');
    db.collection(database.settingsCollection).doc(database.settingsDocument)
      .valueChanges().subscribe( doc => {
        this.settings = doc;
        console.log('Initialized with settings', this.settings);
      });
   }

  ngOnInit(): void {

  }

  openErrorDialog(message: string): void {
    this.dialog.open(ErrorMessageDialogComponent, {
      height: '180px',
      width: '350px',
      data: {errorMessage: message}
    });
  }

}
