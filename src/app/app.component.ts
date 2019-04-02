import { Component, OnInit } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { DataService } from './data.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  title = 'schedulator';
  repData;
  errorMessage;
  successMessage;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.getAllSchedules().subscribe(data => this.repData = data);
  }

  onSave = function(element, isValid: boolean) {
    this.dataService.saveScheduleElement(element).subscribe(res => {
      this.successMessage = res;
      this.errorMessage = [];
      this.ngOnInit();
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
      this.ngOnInit();
    }, error => {
        this.successMessage = [];
        this.errorMessage = error._body;
      });
  };

}
