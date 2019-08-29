import { Injectable } from '@angular/core';
import { ScheduleEntry } from './ScheduleEntry';
import { CalendarEvent } from 'calendar-utils';
import { isBefore, isAfter, isEqual } from 'date-fns';

export interface ConflictError {
  message: string;
  fieldInError: string;
}

@Injectable({
  providedIn: 'root'
})
export class ScheduleUtilService {

  constructor() { }

  isInConflict(schedule: ScheduleEntry, event: CalendarEvent): boolean {
    const isTimeConflict: boolean =
      (isAfter(schedule.from, event.start) || isEqual(schedule.from, event.start)) && isBefore(schedule.from, event.end)
      || isAfter(schedule.to, event.start) && (isBefore(schedule.to, event.end) || isEqual(schedule.to, event.end))
      || isBefore(schedule.from, event.start) && isAfter(schedule.to, event.end);
    return isTimeConflict && (schedule.batch === event.meta.batch || schedule.teacher === event.meta.teacher
      || schedule.room === event.meta.room);
  }


  returnFirstConflict(scheduleEntry: ScheduleEntry, events: CalendarEvent[]): CalendarEvent {
    return events.filter(e => e.meta.id !== scheduleEntry.id) // need to not consider existing element (when updating)
      .find(e => this.isInConflict(scheduleEntry, e));
  }

  getConflictError(scheduleEntry: ScheduleEntry, events: CalendarEvent[]): ConflictError {
    const conflict: CalendarEvent = this.returnFirstConflict(scheduleEntry, events);
    let errorMessage: string;
    let fieldName: string;
    if (conflict) {
      console.warn('Conflict found for event with ID', conflict.meta.id);
      if (scheduleEntry.batch === conflict.meta.batch) {
        errorMessage = scheduleEntry.batch + ' is already busy';
        fieldName = 'batch';
      } else if (scheduleEntry.teacher === conflict.meta.teacher) {
        errorMessage = scheduleEntry.teacher + ' is already busy';
        fieldName = 'teacher';
      } else if (scheduleEntry.room === conflict.meta.room) {
        errorMessage = scheduleEntry.room + ' is already taken';
        fieldName = 'room';
      }
      errorMessage += ' from ' + conflict.start.toLocaleTimeString() + ' to ' + conflict.end.toLocaleTimeString();
      return {message: errorMessage, fieldInError: fieldName};
    } else {
      return null;
    }
  }

}
