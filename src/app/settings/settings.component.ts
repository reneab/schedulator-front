import { Component, OnInit } from '@angular/core';
import {MatChipInputEvent, MatIconRegistry, MatDialog} from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { addWeeks, subWeeks } from 'date-fns';
import { SettingsFirestoreService } from '../settings-firestore.service';
import { ScheduleFirestoreService } from '../schedule-firestore.service';
import { ErrorMessageDialogComponent } from '../error-message-dialog/error-message-dialog.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.less']
})
export class SettingsComponent implements OnInit {

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  toggleColorEdit = false; // used for displaying color schemes editing
  changed = false; // used for disabling Save button
  saved = false; // used for displaying success icon
  loading: boolean; // used to display loading spinner
  disabled: boolean; // used to display overlay
  errorMessage: string;

  settings: any = {colors: {}};

  constructor(public settingsFsService: SettingsFirestoreService,
              public scheduleFsService: ScheduleFirestoreService,
              public iconRegistry: MatIconRegistry,
              public dialog: MatDialog,
              sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.loading = true;
    this.disabled = true;
    this.settingsFsService.getSettings().subscribe(doc => {
      this.loading = false;
      if (doc) {
        this.settings = doc;
        console.log('Loaded settings', this.settings);
        this.disabled = false;
      } else {
        console.log('Settings not found');
        this.dialog.open(ErrorMessageDialogComponent, {
          width: '400px',
          data: { errorMessage: 'Settings not found' }
        });
      }
    },
    err => {
      console.warn('Could not connect to settings database', err);
      this.dialog.open(ErrorMessageDialogComponent, {
        width: '400px',
        data: { errorMessage: 'Could not connect to database' }
      });
    },
    () => console.log('Completed HTTP request to settings database')
    );
  }

  saveSettings(): void {
    this.settingsFsService.updateSettings(this.settings).then(res => {
      console.log('Success');
      this.changed = false;
      this.errorMessage = null;
      this.saved = true;
    }, error => {
      const message = error._body;
      console.log('Error: ' + message);
      this.errorMessage = message;
    });
  }


  remove(el: string, pathToSetting: string): void {
    console.log('Removing ' + el + ' from setting ' + pathToSetting);
    const arr = pathToSetting.split('.').reduce((p, prop) => p[prop], this.settings);
    arr.splice(arr.indexOf(el), 1);
    this.changed = true;
    this.saved = false;
  }

  add(event: MatChipInputEvent, pathToSetting: string): void {
    const input = event.input;
    const value = event.value;

    // Add value to corresponding array
    if ((value || '').trim()) {
      console.log('Adding ' + value + ' to setting ' + pathToSetting);
      const arr = pathToSetting.split('.').reduce((p, prop) => p[prop], this.settings);
      arr.push(value.trim());
      this.changed = true;
      this.saved = false;
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  addOneWeekToTimeStamp(dateInSeconds: number): Date {
    return addWeeks(new Date(dateInSeconds * 1000), 1);
  }

  postponeOneWeek() {
    if (confirm('Are you sure you want to move all schedule events up one week?')) {
      console.warn('Updating all schedules by one week...');
      this.scheduleFsService.getEventsAsSnapshot().forEach((item) => {
        item.docs
        .filter(d => d.data().recurring) // postpone only recurring items
        .forEach(d => {
          console.log('Processing ', d.id, ' on ', new Date(d.data().from.seconds * 1000));
          this.scheduleFsService.updateScheduleEvent(d.id,
            {
              from: this.addOneWeekToTimeStamp(d.data().from.seconds),
              to: this.addOneWeekToTimeStamp(d.data().to.seconds),
            }
          );
        });
      });
    }
  }

  deleteAllSchedules(): void {
    if (confirm('Are you sure you want to delete all schedule events?')) {
      console.warn('Deleting all schedule events...');
      this.scheduleFsService.getEventsAsSnapshot().forEach((item) => {
        item.docs.forEach(d => {
          console.log('Deleting item: ', d.id);
          this.scheduleFsService.deleteScheduleEvent(d.id);
        });
      });
    }
  }
}
