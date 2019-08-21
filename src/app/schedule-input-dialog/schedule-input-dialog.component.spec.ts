import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleInputDialogComponent } from './schedule-input-dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule, MatSelectModule, MatSlideToggleModule } from '@angular/material';
import { MatButtonModule, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AngularFirestore } from '@angular/fire/firestore';
import { ScheduleEntry } from '../ScheduleEntry';
import { format, addHours, addMinutes, isBefore, isAfter, startOfDay, addDays, subDays, subMinutes } from 'date-fns';
import { CalendarEvent } from 'calendar-utils';
import { CalendarEventActionsComponent } from 'angular-calendar/modules/common/calendar-event-actions.component';

const AngularFirestoreStub = {
  collection: (name) => [{ to: new Date(), from: new Date(), title: 'No one cares' }]
};

const SettingsStub = {
  batches: ['2020A'], teachers: ['Jun Rey'], rooms: ['C1', 'C2']
};

const EntryStub = new ScheduleEntry(new Date(), addHours(new Date(), 1), 'Jun Rey', '2020A', 'C1', 'Mechatronics', true);

describe('ScheduleInputDialogComponent', () => {
  let component: ScheduleInputDialogComponent;
  let fixture: ComponentFixture<ScheduleInputDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatDialogModule,
        MatSlideToggleModule
      ],
      declarations: [ScheduleInputDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: AngularFirestore, useValue: AngularFirestoreStub },
        {
          provide: MAT_DIALOG_DATA, useValue: {
            settings: SettingsStub,
            events: [],
            editing: false,
            day: new Date(),
            entry: EntryStub
          }
        },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleInputDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should properly convert time to a date today', () => {
    component.day = new Date();
    const expected: Date = new Date(new Date().setHours(7, 30, 0, 0));
    expect(component.convertTimeInputToDate('07:30')).toEqual(expected);
  });

  it('should return conflict if teacher is busy', () => {
    const dayStart = startOfDay(new Date());
    const existingEvent: CalendarEvent = {
      start: dayStart, end: addHours(dayStart, 1), title: '',
      meta: { teacher: 'Jun Rey' }
    };
    const toAdd = new ScheduleEntry(dayStart, addMinutes(dayStart, 30), 'Jun Rey', '2020A', 'C1', 'Mecha', true);
    expect(component.isInConflict(toAdd, existingEvent)).toEqual(true);
  });

  it('should return conflict if batch is busy', () => {
    const dayStart = startOfDay(new Date());
    const existingEvent: CalendarEvent = {
      start: dayStart, end: addHours(dayStart, 1), title: '',
      meta: { batch: '2020A' }
    };
    const toAdd = new ScheduleEntry(dayStart, addMinutes(dayStart, 30), 'Jun Rey', '2020A', 'C1', 'Mecha', true);
    expect(component.isInConflict(toAdd, existingEvent)).toEqual(true);
  });

  it('should return conflict if room is taken', () => {
    const dayStart = startOfDay(new Date());
    const existingEvent: CalendarEvent = {
      start: dayStart, end: addHours(dayStart, 1), title: '',
      meta: { room: 'C1' }
    };
    const toAdd = new ScheduleEntry(dayStart, addMinutes(dayStart, 30), 'Jun Rey', '2020A', 'C1', 'Mecha', true);
    expect(component.isInConflict(toAdd, existingEvent)).toEqual(true);
  });

  it('should return no conflict if event is right after existing event', () => {
    const dayStart = startOfDay(new Date());
    const existingEvent: CalendarEvent = {
      start: addHours(dayStart, 7), end: addHours(dayStart, 8), title: '',
      meta: { room: 'C1' }
    };
    const toAdd = new ScheduleEntry(addHours(dayStart, 8), addHours(dayStart, 9), 'Jun Rey', '2020A', 'C1', 'Mecha', true);
    expect(component.isInConflict(toAdd, existingEvent)).toEqual(false);
  });

  it('should return no conflict if event is right before existing event', () => {
    const dayStart = startOfDay(new Date());
    const existingEvent: CalendarEvent = {
      start: addHours(dayStart, 7), end: addHours(dayStart, 8), title: '',
      meta: { room: 'C1' }
    };
    const toAdd = new ScheduleEntry(addHours(dayStart, 5), addHours(dayStart, 7), 'Jun Rey', '2020A', 'C1', 'Mecha', true);
    expect(component.isInConflict(toAdd, existingEvent)).toEqual(false);
  });

  it('should return no conflict if event is the day after existing event', () => {
    const dayStart = startOfDay(new Date());
    const existingEvent: CalendarEvent = {
      start: addHours(dayStart, 7), end: addHours(dayStart, 8), title: '',
      meta: { room: 'C1' }
    };
    const toAdd = new ScheduleEntry(addDays(existingEvent.start, 1), addDays(existingEvent.end, 1),
      'Jun Rey', '2020A', 'C1', 'Mecha', true);
    expect(component.isInConflict(toAdd, existingEvent)).toEqual(false);
  });

  it('should return no conflict if event is the day before existing event', () => {
    const dayStart = startOfDay(new Date());
    const existingEvent: CalendarEvent = {
      start: addHours(dayStart, 7), end: addHours(dayStart, 8), title: '',
      meta: { room: 'C1' }
    };
    const toAdd = new ScheduleEntry(subDays(existingEvent.start, 1), subDays(existingEvent.end, 1),
      'Jun Rey', '2020A', 'C1', 'Mecha', true);
    expect(component.isInConflict(toAdd, existingEvent)).toEqual(false);
  });

  it('should return conflict even if start and end dates are the same', () => {
    const dayStart = startOfDay(new Date());
    const existingEvent: CalendarEvent = {
      start: addHours(dayStart, 1), end: addHours(dayStart, 2), title: '',
      meta: { room: 'C1' }
    };
    const toAdd = new ScheduleEntry(addHours(dayStart, 1), addHours(dayStart, 2), 'Jun Rey', '2020A', 'C1', 'Mecha', true);
    expect(component.isInConflict(toAdd, existingEvent)).toEqual(true);
  });

  it('should return conflict if new event starts after and ends after existing event', () => {
    const dayStart = startOfDay(new Date());
    const existingEvent: CalendarEvent = {
      start: addHours(dayStart, 1), end: addHours(dayStart, 2), title: '',
      meta: { room: 'C1' }
    };
    const toAdd = new ScheduleEntry(addMinutes(existingEvent.start, 15), addMinutes(existingEvent.end, 20),
      'Jun Rey', '2020A', 'C1', 'Mecha', true);
    expect(component.isInConflict(toAdd, existingEvent)).toEqual(true);
  });

  it('should return conflict if new event starts before and ends earlier then existing event', () => {
    const dayStart = startOfDay(new Date());
    const existingEvent: CalendarEvent = {
      start: addHours(dayStart, 1), end: addHours(dayStart, 3), title: '',
      meta: { room: 'C1' }
    };
    const toAdd = new ScheduleEntry(subMinutes(existingEvent.start, 15), subMinutes(existingEvent.end, 20),
      'Jun Rey', '2020A', 'C1', 'Mecha', true);
    expect(component.isInConflict(toAdd, existingEvent)).toEqual(true);
  });

  it('should return conflict if new event is included in the existing', () => {
    const dayStart = startOfDay(new Date());
    const existingEvent: CalendarEvent = {
      start: addHours(dayStart, 1), end: addHours(dayStart, 4), title: '',
      meta: { room: 'C1' }
    };
    const toAdd = new ScheduleEntry(addHours(dayStart, 2), addHours(dayStart, 3), 'Jun Rey', '2020A', 'C1', 'Mecha', true);
    expect(component.isInConflict(toAdd, existingEvent)).toEqual(true);
  });

  it('should return conflict if new event includes the existing', () => {
    const dayStart = startOfDay(new Date());
    const existingEvent: CalendarEvent = {
      start: addHours(dayStart, 4), end: addHours(dayStart, 5), title: '',
      meta: { room: 'C1' }
    };
    const toAdd = new ScheduleEntry(addHours(dayStart, 2), addHours(dayStart, 7), 'Jun Rey', '2020A', 'C1', 'Mecha', true);
    expect(component.isInConflict(toAdd, existingEvent)).toEqual(true);
  });

  it('should return no conflict if there are no events', () => {
    const dayStart = startOfDay(new Date());
    component.events = [];
    const toAdd = new ScheduleEntry(dayStart, addMinutes(dayStart, 30), 'Jun Rey', '2020A', 'C1', 'Mecha', true);
    expect(component.returnFirstConflict(toAdd)).toBeUndefined();
  });

  it('should return an element if there is a conflicting events', () => {
    const dayStart = startOfDay(new Date());
    const existingEvent: CalendarEvent = {start: dayStart, end: addHours(dayStart, 1), title: '',
      meta: { id: 'specialevent', teacher: 'Jun Rey' }
    };
    component.events = [existingEvent];
    const toAdd = new ScheduleEntry(dayStart, addMinutes(dayStart, 30), 'Jun Rey', '2020A', 'C1', 'Mecha', true);
    expect(component.returnFirstConflict(toAdd)).toBeDefined();
  });

});
