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
  scheduleData: any;
  // empty initialization before settings arrive from back-end
  settings = {timeslots: [], batches: [], rooms: [], teachers: []};

  constructor(private dataService: DataService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.dataService.getAllSettings().subscribe(data => {
      this.settings = data;
    });
    this.refreshSchedules();
  }

  // reformat schedule data per batch, to fit in the schedule grid
  // TODO later parametrize this one to be able to filter by teacher and room
  private formatSchedule = function(entries: ScheduleEntry[]) {
    return this.settings.timeslots.map((t: string) => {
      const filtered = entries.filter(d => d.time === t);
      const final = this.settings.batches.map(b => filtered.find(e => e.batch === b));
      return {time: t, data: final};
    });
  };

  private refreshSchedules = function() {
    console.log('Loading schedules...');
    this.dataService.getAllSchedules().subscribe(data => {
      const arr: ScheduleEntry[] = data.map(e => new ScheduleEntry(e._id, e.time, e.teacher, e.batch, e.room, e.subject));
      this.scheduleData = this.formatSchedule(arr);
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
