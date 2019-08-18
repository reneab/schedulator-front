import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleInputDialogComponent } from './schedule-input-dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule, MatSelectModule, } from '@angular/material';
import { MatButtonModule, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AngularFirestore } from '@angular/fire/firestore';
import { ScheduleEntry } from '../ScheduleEntry';
import { format, addHours, addMinutes, isBefore, isAfter, startOfDay, addDays, subDays } from 'date-fns';
import { CalendarEvent } from 'calendar-utils';
import { CalendarEventActionsComponent } from 'angular-calendar/modules/common/calendar-event-actions.component';

const AngularFirestoreStub = {
  collection: (name) => [{to: new Date(), from: new Date(), title: 'No one cares'}]
};

const SettingsStub = {
  batches: ['2020A'], teachers: ['Jun Rey'], rooms: ['C1', 'C2']
};

const EntryStub = new ScheduleEntry(new Date(), addHours(new Date(), 1), 'Jun Rey', '2020A', 'C1', 'Mechatronics');

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
        MatDialogModule
      ],
      declarations: [ ScheduleInputDialogComponent ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: AngularFirestore, useValue: AngularFirestoreStub },
        { provide: MAT_DIALOG_DATA, useValue: {
          settings: SettingsStub,
          events: [],
          editing: false,
          day: new Date(),
          entry: EntryStub
        }},
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

  it('should return no conflict if no events', () => {
    component.events = [];
    const toAdd = {from: new Date(), to: addHours(new Date(), 1), batch: '2020A', teacher: 'Jun Rey', room: 'C1'};
    expect(component.checkForConflict(toAdd)).toBeUndefined();
  });

  it('should return teacher conflict if teacher is busy', () => {
    const dayStart = startOfDay(new Date());
    const existingEvent: CalendarEvent = {
      start: dayStart,
      end: addHours(dayStart, 1),
      title: '',
      meta: {teacher: 'Jun Rey'}
    };
    component.events.push(existingEvent);
    const toAdd = {from: dayStart, to: addMinutes(dayStart, 30), batch: '2020A', teacher: 'Jun Rey', room: 'C1'};
    expect(component.checkForConflict(toAdd)).toEqual('Jun Rey');
  });

  it('should return batch conflict if batch is busy', () => {
    const dayStart = startOfDay(new Date());
    const existingEvent: CalendarEvent = {
      start: dayStart,
      end: addHours(dayStart, 1),
      title: '',
      meta: {batch: '2020A'}
    };
    component.events.push(existingEvent);
    const toAdd = {from: dayStart, to: addMinutes(dayStart, 30), batch: '2020A', teacher: 'Jun Rey', room: 'C1'};
    expect(component.checkForConflict(toAdd)).toEqual('2020A');
  });

  it('should return room conflict if room is taken', () => {
    const dayStart = startOfDay(new Date());
    const existingEvent: CalendarEvent = {
      start: dayStart,
      end: addHours(dayStart, 1),
      title: '',
      meta: {room: 'C1'}
    };
    component.events.push(existingEvent);
    const toAdd = {from: dayStart, to: addMinutes(dayStart, 30), batch: '2020A', teacher: 'Jun Rey', room: 'C1'};
    expect(component.checkForConflict(toAdd)).toEqual('C1');
  });

  it('should return no conflict if event is right after existing event', () => {
    const dayStart = startOfDay(new Date());
    const existingEvent: CalendarEvent = {
      start: addHours(dayStart, 7),
      end: addHours(dayStart, 8),
      title: '',
      meta: {room: 'C1'}
    };
    component.events.push(existingEvent);
    const toAdd = {from: addHours(dayStart, 8), to: addHours(dayStart, 9), batch: '2020A', teacher: 'Jun Rey', room: 'C1'};
    expect(component.checkForConflict(toAdd)).toBeUndefined();
  });

  it('should return no conflict if event is right before existing event', () => {
    const dayStart = startOfDay(new Date());
    const existingEvent: CalendarEvent = {
      start: addHours(dayStart, 7),
      end: addHours(dayStart, 8),
      title: '',
      meta: {room: 'C1'}
    };
    component.events.push(existingEvent);
    const toAdd = {from: addHours(dayStart, 5), to: addHours(dayStart, 7), batch: '2020A', teacher: 'Jun Rey', room: 'C1'};
    expect(component.checkForConflict(toAdd)).toBeUndefined();
  });

  it('should return no conflict if event is the day after existing event', () => {
    const dayStart = startOfDay(new Date());
    const existingEvent: CalendarEvent = {
      start: addHours(dayStart, 7),
      end: addHours(dayStart, 8),
      title: '',
      meta: {room: 'C1'}
    };
    component.events.push(existingEvent);
    const toAdd = {from: addDays(dayStart, 1), to: addHours(addDays(dayStart, 1), 1), batch: '2020A', teacher: 'Jun Rey', room: 'C1'};
    expect(component.checkForConflict(toAdd)).toBeUndefined();
  });

  it('should return no conflict if event is the day before existing event', () => {
    const dayStart = startOfDay(new Date());
    const existingEvent: CalendarEvent = {
      start: addHours(dayStart, 7),
      end: addHours(dayStart, 8),
      title: '',
      meta: {room: 'C1'}
    };
    component.events.push(existingEvent);
    const toAdd = {from: subDays(dayStart, 1), to: addHours(subDays(dayStart, 1), 2), batch: '2020A', teacher: 'Jun Rey', room: 'C1'};
    expect(component.checkForConflict(toAdd)).toBeUndefined();
  });

  it('should return conflict if new event starts after and ends after existing event', () => {
    const dayStart = startOfDay(new Date());
    const existingEvent: CalendarEvent = {
      start: addHours(dayStart, 1),
      end: addHours(dayStart, 2),
      title: '',
      meta: {room: 'C1'}
    };
    component.events.push(existingEvent);
    const toAdd = {from: addMinutes(addHours(dayStart, 1), 30), to: addMinutes(addHours(dayStart, 2), 30),
      batch: '2020A', teacher: 'Jun Rey', room: 'C1'};
    expect(component.checkForConflict(toAdd)).toBeDefined();
  });

  it('should return conflict if new event starts before and ends earlier then existing event', () => {
    const dayStart = startOfDay(new Date());
    const existingEvent: CalendarEvent = {
      start: addHours(dayStart, 1),
      end: addHours(dayStart, 2),
      title: '',
      meta: {room: 'C1'}
    };
    component.events.push(existingEvent);
    const toAdd = {from: addMinutes(dayStart, 30), to: addMinutes(addHours(dayStart, 1), 30),
      batch: '2020A', teacher: 'Jun Rey', room: 'C1'};
    expect(component.checkForConflict(toAdd)).toBeDefined();
  });

  it('should return conflict if new event is included in the existing', () => {
    const dayStart = startOfDay(new Date());
    const existingEvent: CalendarEvent = {
      start: addHours(dayStart, 1),
      end: addHours(dayStart, 4),
      title: '',
      meta: {room: 'C1'}
    };
    component.events.push(existingEvent);
    const toAdd = {from: addHours(dayStart, 2), to: addHours(dayStart, 3),
      batch: '2020A', teacher: 'Jun Rey', room: 'C1'};
    expect(component.checkForConflict(toAdd)).toBeDefined();
  });

  it('should return conflict if new event includes the existing', () => {
    const dayStart = startOfDay(new Date());
    const existingEvent: CalendarEvent = {
      start: addHours(dayStart, 4),
      end: addHours(dayStart, 5),
      title: '',
      meta: {room: 'C1'}
    };
    component.events.push(existingEvent);
    const toAdd = {from: addHours(dayStart, 1), to: addHours(dayStart, 6),
      batch: '2020A', teacher: 'Jun Rey', room: 'C1'};
    expect(component.checkForConflict(toAdd)).toBeDefined();
  });

  it('should return conflict even if start and end dates are the same', () => {
    const dayStart = startOfDay(new Date());
    const existingEvent: CalendarEvent = {
      start: addHours(dayStart, 1),
      end: addHours(dayStart, 2),
      title: '',
      meta: {room: 'C1'}
    };
    component.events.push(existingEvent);
    const toAdd = {from: addHours(dayStart, 1), to: addHours(dayStart, 2), batch: '2020A', teacher: 'Jun Rey', room: 'C1'};
    expect(component.checkForConflict(toAdd)).toBeDefined();
  });
});
