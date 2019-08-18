import { Component, OnInit } from '@angular/core';
import {MatChipInputEvent, MatIconRegistry} from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import {COMMA, ENTER} from '@angular/cdk/keycodes';

import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { database } from 'src/environments/environment';
import { ScheduleEntry } from '../ScheduleEntry';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.less']
})
export class SettingsComponent implements OnInit {

  changed = false; // used for disabling Save button
  saved = false; // used for displaying success icon
  errorMessage: string;

  settingsDocRef: AngularFirestoreDocument<any>;
  settings: any = {};

  schedulesCollRef: AngularFirestoreCollection<any>;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(public db: AngularFirestore, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    this.settingsDocRef = db.collection(database.settingsCollection).doc(database.settingsDocument);
    this.settingsDocRef.valueChanges().subscribe( doc => {
      console.log(doc);
      this.settings = doc;
    });

    this.schedulesCollRef = db.collection(database.schedulesCollection);

  }

  saveSettings(): void {
    this.settingsDocRef.update(this.settings).then(res => {
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

  ngOnInit(): void {
  }

  remove(el: string, settingName: string): void {
    console.log('Removing ' + el + ' from setting ' + settingName);
    const index = this.settings[settingName].indexOf(el);
    if (index >= 0) {
      this.settings[settingName].splice(index, 1);
      this.changed = true;
      this.saved = false;
    }
  }

  add(event: MatChipInputEvent, settingName: string): void {
    const input = event.input;
    const value = event.value;

    // Add value to corresponding array
    if ((value || '').trim()) {
      console.log('Adding ' + value + ' to setting ' + settingName);
      this.settings[settingName].push(value.trim());
      this.changed = true;
      this.saved = false;
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  addOneWeekInSeconds(dateInSeconds: number): Date {
    return new Date((dateInSeconds + 7 * 24 * 60 * 60) * 1000);
  }

  postponeOneWeek = () => {
    if (confirm('Are you sure you want to import all schedule events from last week?')) {
      console.warn('Updating all schedules by one week...');
      this.schedulesCollRef.get().forEach((item) => {
        return item.docs.map(d => {
          console.log('Processing ', d.id, ' on ', new Date(d.data().from.seconds * 1000));
          return this.db.doc(`schedules/${d.id}`).update(
            {
              from: this.addOneWeekInSeconds(d.data().from.seconds),
              to: this.addOneWeekInSeconds(d.data().to.seconds),
            }
          );
        });
      });
    }
  }

  deleteAllSchedules(): void {
    if (confirm('Are you sure you want to delete all schedule events?')) {
      console.warn('Deleting all schedule events...');
      this.schedulesCollRef.get().forEach((item) => {
        item.docs.forEach(d => {
          console.log('Deleting item: ', d.id);
          this.db.doc(`schedules/${d.id}`).delete();
        });
      });
    }
  }
}
