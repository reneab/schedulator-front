import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { MatDialog } from '@angular/material';
import { ErrorMessageDialogComponent } from '../error-message-dialog/error-message-dialog.component';
import { ScheduleEntry } from '../ScheduleEntry';

@Component({
  selector: 'app-schedule-table',
  templateUrl: './schedule-table.component.html',
  styleUrls: ['./schedule-table.component.less']
})
export class ScheduleTableComponent implements OnInit {

  title = 'schedulator';
  // empty initialization before data arrives from back-end
  settings = {timeslots: [], batches: [], rooms: [], teachers: []};

  constructor(private dataService: DataService, public dialog: MatDialog) { }

  ngOnInit(): void {
    console.log('Loading settings...');
    this.dataService.getAllSettings().subscribe(data => {
      console.log('Done!');
      this.settings = data;
    });
    this.refreshSchedules();
  }

  // reformat schedule data according to a certain setting parameter to be displayed in column (batch, teacher or room)
  private formatSchedule = function(rawData: ScheduleEntry[], settingAsCol: string, scheduleAttribute: string) {
    return this.settings.timeslots.map((t: string) => {
      const byTimeSlot = rawData.filter(d => d.time === t);
      const completeArray = this.settings[settingAsCol].map(col => byTimeSlot.find(e => e[scheduleAttribute] === col));
      return {time: t, entries: completeArray};
    });
  };

  private refreshSchedules = function() {
    console.log('Loading schedules...');
    this.dataService.getAllSchedules().subscribe(data => {
      console.log('Done!');
      const rawData = data.map(e => new ScheduleEntry(e._id, e.time, e.teacher, e.batch, e.room, e.subject));
      // TODO improve this one to make it more generic
      // and to load only the necessary one per tab
      this.dataPerBatch = this.formatSchedule(rawData, 'batches', 'batch');
      this.dataPerTeacher = this.formatSchedule(rawData, 'teachers', 'teacher');
      this.dataPerRoom = this.formatSchedule(rawData, 'rooms', 'room');
    });
  };

  openErrorDialog(message: string): void {
    this.dialog.open(ErrorMessageDialogComponent, {
      height: '180px',
      width: '350px',
      data: {errorMessage: message}
    });
  }

}
