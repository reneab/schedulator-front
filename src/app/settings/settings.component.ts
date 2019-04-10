import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import {MatChipInputEvent, MatIconRegistry} from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import {COMMA, ENTER} from '@angular/cdk/keycodes';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.less']
})
export class SettingsComponent implements OnInit {

  changed = false; // used for disabling Save button
  saved = false; // used for displaying success icon
  errorMessage: string;
  settings = {timeslots: [], batches: [], rooms: [], teachers: []};
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(private dataService: DataService, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
  }

  private loadSettings(): void {
    this.dataService.getAllSettings().subscribe(data => {
      this.settings = data;
    });
  }

  saveSettings(): void {
    this.dataService.saveSettings(this.settings).subscribe(res => {
      console.log(res);
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
    this.loadSettings();
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

}