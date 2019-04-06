import { Component, OnInit } from '@angular/core';
import { DataService } from './data.service';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { ScheduleEntry } from './ScheduleEntry';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  title = 'schedulator';
  scheduleData;
  errorMessage;
  successMessage;
  scheduleForm: FormGroup;
  // empty initialization before settings arrive from back-end
  settings = {timeslots: [], batches: [], rooms: [], teachers: []};

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.getAllSettings().subscribe(data => {
      this.settings = data;
      this.scheduleForm = new FormGroup({
        time: new FormControl(this.settings.timeslots[0]),
        batch: new FormControl(this.settings.batches[0]),
        teacher: new FormControl(this.settings.teachers[0]),
        room: new FormControl(this.settings.rooms[0]),
        subject: new FormControl()
      });
    });
    this.refreshSchedules();

    // empty initialization before settings arrive from back-end
    this.scheduleForm = new FormGroup({
      time: new FormControl(),
      batch: new FormControl(),
      teacher: new FormControl(),
      room: new FormControl(),
      subject: new FormControl()
    });
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

  onSave = function(element, isValid: boolean) {
    this.dataService.saveScheduleElement(element).subscribe(res => {
      this.successMessage = res;
      this.errorMessage = [];
      this.refreshSchedules();
    }, error => {
      this.successMessage = [];
      this.errorMessage = error._body;
    });
  };

}
