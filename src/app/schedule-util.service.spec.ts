import { TestBed } from '@angular/core/testing';
import { format, addHours, addMinutes, isBefore, isAfter, startOfDay, addDays, subDays, subMinutes } from 'date-fns';
import { CalendarEvent } from 'calendar-utils';
import { ScheduleEntry } from './ScheduleEntry';
import { ScheduleUtilService } from './schedule-util.service';

describe('ScheduleUtilService', () => {

  let service: ScheduleUtilService;

  beforeEach(() => {
    TestBed.configureTestingModule({ });
    service = new ScheduleUtilService();
  });

  it('should be created', () => {
    service = TestBed.get(ScheduleUtilService);
    expect(service).toBeTruthy();
  });

  it('should return conflict if teacher is busy', () => {
    const dayStart = startOfDay(new Date());
    const existingEvent: CalendarEvent = {
      start: dayStart, end: addHours(dayStart, 1), title: '',
      meta: { teacher: 'Jun Rey' }
    };
    const toAdd = new ScheduleEntry(dayStart, addMinutes(dayStart, 30), 'Jun Rey', '2020A', 'C1', 'Mecha', true);
    expect(service.isInConflict(toAdd, existingEvent)).toEqual(true);
  });

  it('should return conflict if batch is busy', () => {
    const dayStart = startOfDay(new Date());
    const existingEvent: CalendarEvent = {
      start: dayStart, end: addHours(dayStart, 1), title: '',
      meta: { batch: '2020A' }
    };
    const toAdd = new ScheduleEntry(dayStart, addMinutes(dayStart, 30), 'Jun Rey', '2020A', 'C1', 'Mecha', true);
    expect(service.isInConflict(toAdd, existingEvent)).toEqual(true);
  });

  it('should return conflict if room is taken', () => {
    const dayStart = startOfDay(new Date());
    const existingEvent: CalendarEvent = {
      start: dayStart, end: addHours(dayStart, 1), title: '',
      meta: { room: 'C1' }
    };
    const toAdd = new ScheduleEntry(dayStart, addMinutes(dayStart, 30), 'Jun Rey', '2020A', 'C1', 'Mecha', true);
    expect(service.isInConflict(toAdd, existingEvent)).toEqual(true);
  });

  it('should return no conflict if event is right after existing event', () => {
    const dayStart = startOfDay(new Date());
    const existingEvent: CalendarEvent = {
      start: addHours(dayStart, 7), end: addHours(dayStart, 8), title: '',
      meta: { room: 'C1' }
    };
    const toAdd = new ScheduleEntry(addHours(dayStart, 8), addHours(dayStart, 9), 'Jun Rey', '2020A', 'C1', 'Mecha', true);
    expect(service.isInConflict(toAdd, existingEvent)).toEqual(false);
  });

  it('should return no conflict if event is right before existing event', () => {
    const dayStart = startOfDay(new Date());
    const existingEvent: CalendarEvent = {
      start: addHours(dayStart, 7), end: addHours(dayStart, 8), title: '',
      meta: { room: 'C1' }
    };
    const toAdd = new ScheduleEntry(addHours(dayStart, 5), addHours(dayStart, 7), 'Jun Rey', '2020A', 'C1', 'Mecha', true);
    expect(service.isInConflict(toAdd, existingEvent)).toEqual(false);
  });

  it('should return no conflict if event is the day after existing event', () => {
    const dayStart = startOfDay(new Date());
    const existingEvent: CalendarEvent = {
      start: addHours(dayStart, 7), end: addHours(dayStart, 8), title: '',
      meta: { room: 'C1' }
    };
    const toAdd = new ScheduleEntry(addDays(existingEvent.start, 1), addDays(existingEvent.end, 1),
      'Jun Rey', '2020A', 'C1', 'Mecha', true);
    expect(service.isInConflict(toAdd, existingEvent)).toEqual(false);
  });

  it('should return no conflict if event is the day before existing event', () => {
    const dayStart = startOfDay(new Date());
    const existingEvent: CalendarEvent = {
      start: addHours(dayStart, 7), end: addHours(dayStart, 8), title: '',
      meta: { room: 'C1' }
    };
    const toAdd = new ScheduleEntry(subDays(existingEvent.start, 1), subDays(existingEvent.end, 1),
      'Jun Rey', '2020A', 'C1', 'Mecha', true);
    expect(service.isInConflict(toAdd, existingEvent)).toEqual(false);
  });

  it('should return conflict even if start and end dates are the same', () => {
    const dayStart = startOfDay(new Date());
    const existingEvent: CalendarEvent = {
      start: addHours(dayStart, 1), end: addHours(dayStart, 2), title: '',
      meta: { room: 'C1' }
    };
    const toAdd = new ScheduleEntry(addHours(dayStart, 1), addHours(dayStart, 2), 'Jun Rey', '2020A', 'C1', 'Mecha', true);
    expect(service.isInConflict(toAdd, existingEvent)).toEqual(true);
  });

  it('should return conflict if new event starts after and ends after existing event', () => {
    const dayStart = startOfDay(new Date());
    const existingEvent: CalendarEvent = {
      start: addHours(dayStart, 1), end: addHours(dayStart, 2), title: '',
      meta: { room: 'C1' }
    };
    const toAdd = new ScheduleEntry(addMinutes(existingEvent.start, 15), addMinutes(existingEvent.end, 20),
      'Jun Rey', '2020A', 'C1', 'Mecha', true);
    expect(service.isInConflict(toAdd, existingEvent)).toEqual(true);
  });

  it('should return conflict if new event starts before and ends earlier then existing event', () => {
    const dayStart = startOfDay(new Date());
    const existingEvent: CalendarEvent = {
      start: addHours(dayStart, 1), end: addHours(dayStart, 3), title: '',
      meta: { room: 'C1' }
    };
    const toAdd = new ScheduleEntry(subMinutes(existingEvent.start, 15), subMinutes(existingEvent.end, 20),
      'Jun Rey', '2020A', 'C1', 'Mecha', true);
    expect(service.isInConflict(toAdd, existingEvent)).toEqual(true);
  });

  it('should return conflict if new event is included in the existing', () => {
    const dayStart = startOfDay(new Date());
    const existingEvent: CalendarEvent = {
      start: addHours(dayStart, 1), end: addHours(dayStart, 4), title: '',
      meta: { room: 'C1' }
    };
    const toAdd = new ScheduleEntry(addHours(dayStart, 2), addHours(dayStart, 3), 'Jun Rey', '2020A', 'C1', 'Mecha', true);
    expect(service.isInConflict(toAdd, existingEvent)).toEqual(true);
  });

  it('should return conflict if new event includes the existing', () => {
    const dayStart = startOfDay(new Date());
    const existingEvent: CalendarEvent = {
      start: addHours(dayStart, 4), end: addHours(dayStart, 5), title: '',
      meta: { room: 'C1' }
    };
    const toAdd = new ScheduleEntry(addHours(dayStart, 2), addHours(dayStart, 7), 'Jun Rey', '2020A', 'C1', 'Mecha', true);
    expect(service.isInConflict(toAdd, existingEvent)).toEqual(true);
  });

  it('should return no conflict if teacher is USC', () => {
    const dayStart = startOfDay(new Date());
    const existingEvent: CalendarEvent = {
      start: addHours(dayStart, 4), end: addHours(dayStart, 5), title: '',
      meta: { teacher: 'USC', room: 'USC' }
    };
    const toAdd = new ScheduleEntry(addHours(dayStart, 4), addHours(dayStart, 5), 'USC', '2020A', 'C1', 'Mecha', true);
    expect(service.isInConflict(toAdd, existingEvent)).toEqual(false);
  });

  it('should return no conflict if room is USC', () => {
    const dayStart = startOfDay(new Date());
    const existingEvent: CalendarEvent = {
      start: addHours(dayStart, 4), end: addHours(dayStart, 5), title: '',
      meta: { teacher: 'USC', room: 'USC' }
    };
    const toAdd = new ScheduleEntry(addHours(dayStart, 4), addHours(dayStart, 5), 'Jun Rey', '2020A', 'USC', 'Mecha', true);
    expect(service.isInConflict(toAdd, existingEvent)).toEqual(false);
  });

  it('should return no conflict if there are no events', () => {
    const dayStart = startOfDay(new Date());
    const events = [];
    const toAdd = new ScheduleEntry(dayStart, addMinutes(dayStart, 30), 'Jun Rey', '2020A', 'C1', 'Mecha', true);
    expect(service.returnFirstConflict(toAdd, events)).toBeUndefined();
  });

  it('should return an element if there is a conflicting events', () => {
    const dayStart = startOfDay(new Date());
    const existingEvent: CalendarEvent = {start: dayStart, end: addHours(dayStart, 1), title: '',
      meta: { id: 'specialevent', teacher: 'Jun Rey' }
    };
    const events = [existingEvent];
    const toAdd = new ScheduleEntry(dayStart, addMinutes(dayStart, 30), 'Jun Rey', '2020A', 'C1', 'Mecha', true);
    expect(service.returnFirstConflict(toAdd, events)).toBeDefined();
  });

});
