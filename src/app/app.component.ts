import { Component, OnInit } from '@angular/core';
import { DataService } from './data.service';
import { ScheduleEntry } from './ScheduleEntry';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  title = 'schedulator';
  scheduleData: any;
  // empty initialization before settings arrive from back-end
  settings = {timeslots: [], batches: [], rooms: [], teachers: []};

  constructor(private dataService: DataService) { }

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

}
