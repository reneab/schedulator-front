import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

import { environment } from '../environments/environment';

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: Http) { }


  public saveScheduleElement(element, id?: string) {
    if (id) {
      return this.http.post(API_URL + '/schedules/update/' + id, element)
        .map((response: Response) => response.text());
    } else {
      return this.http.post(API_URL + '/schedules/save', element)
        .map((response: Response) => response.text());
    }
  }

  public getAllSchedules() {
      return this.http.get(API_URL + '/schedules/all')
        .map((response: Response) => response.json());
  }

  public deleteScheduleElement(id: string) {
      return this.http.delete(API_URL + '/schedules/' + id)
        .map((response: Response) => response.text());
  }

  // Settings
  public getAllSettings() {
    return this.http.get(API_URL + '/settings/all')
      .map((response: Response) => response.json());
  }

  public saveSettings(settings) {
    return this.http.post(API_URL + '/settings/save', settings)
      .map((response: Response) => response.text());
  }
}
