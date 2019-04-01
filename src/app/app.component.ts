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

  constructor(private newService: DataService) { }

  ngOnInit(): void {
    this.newService.getAllSchedules().subscribe(data => this.repData = data);
  }
}
