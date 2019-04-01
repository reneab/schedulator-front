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


  public saveScheduleElement(element) {
    return this.http.post(API_URL + '/schedules/save', element)
      .map((response: Response) => response.json());
  }

  public getAllSchedules() {
      return this.http.get(API_URL + '/schedules/all')
        .map((response: Response) => response.json());
        // TODO possible to map this to a real Object directly
  }

  public deleteScheduleElement(id: string) {
      return this.http.delete(API_URL + '/schedules/' + id)
        .map((response: Response) => response.json());
  }

}
