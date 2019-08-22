import { Component, OnInit } from '@angular/core';
import {MatIconRegistry} from '@angular/material';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  title = 'Schedule Master';
  public version: string = environment.VERSION;

  constructor() { }

  ngOnInit(): void { }

}
