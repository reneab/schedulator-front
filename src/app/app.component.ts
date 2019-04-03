import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { DataService } from './data.service';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';

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

  private refreshSchedules = function() {
    this.dataService.getAllSchedules().subscribe(data => this.scheduleData = data);
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

  delete = function(id: string) {
    this.dataService.deleteScheduleElement(id)
    .subscribe(res => {
      this.successMessage = res;
      this.errorMessage = [];
      this.refreshSchedules();
    }, error => {
        this.successMessage = [];
        this.errorMessage = error._body;
      });
  };

}
