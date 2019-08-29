import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleInputDialogComponent } from './schedule-input-dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule, MatSelectModule, MatSlideToggleModule } from '@angular/material';
import { MatButtonModule, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ScheduleEntry } from '../ScheduleEntry';
import { addHours } from 'date-fns';
import { ScheduleFirestoreService } from '../schedule-firestore.service';
import { ScheduleUtilService } from '../schedule-util.service';

const SettingsStub = {
  batches: ['2020A'], teachers: ['Jun Rey'], rooms: ['C1', 'C2']
};

const ServiceStub = {
  test: () => {}
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
        { provide: ScheduleFirestoreService, useValue: ServiceStub},
        { provide: ScheduleUtilService, useValue: ServiceStub},
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {
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

});
