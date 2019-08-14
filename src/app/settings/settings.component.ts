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

  settingsDoc: AngularFirestoreDocument<any>;
  settings: any = {};

  schedulesColl: AngularFirestoreCollection<any>;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(public db: AngularFirestore, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    this.settingsDoc = db.collection(database.settingsCollection).doc(database.settingsDocument);
    this.settingsDoc.valueChanges().subscribe( doc => {
      console.log(doc);
      this.settings = doc;
    });

    this.schedulesColl = db.collection(database.schedulesCollection);

  }

  saveSettings(): void {
    this.settingsDoc.update(this.settings).then(res => {
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

  addOneWeekInSeconds = (dateInSeconds) => {
    return new Date((dateInSeconds + 7 * 24 * 60 * 60) * 1000);
  }

  postponeOneWeek = () => {
    console.warn('Updating all schedules by one week...');
    this.schedulesColl.get().forEach((item) => {
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
