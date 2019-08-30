import { Component, OnInit, Input } from '@angular/core';
import { CalendarEvent, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { addHours, startOfDay, addWeeks, subWeeks } from 'date-fns';
import { MatDialog } from '@angular/material';
import { ScheduleInputDialogComponent } from '../schedule-input-dialog/schedule-input-dialog.component';
import { ScheduleEntry } from '../ScheduleEntry';
import { ErrorMessageDialogComponent } from '../error-message-dialog/error-message-dialog.component';
import { ScheduleFirestoreService } from '../schedule-firestore.service';
import { ScheduleUtilService } from '../schedule-util.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.less']
})
export class CalendarComponent implements OnInit {

  @Input() settings: any;
  @Input() events: CalendarEvent[];
  @Input() filteringKey: string;
  @Input() settingsFilteringKey: string;
  @Input() loading: boolean;

  // TODO: create toggle button to make filtering exclusive or multiple

  viewDate: Date = new Date();
  filteredEvents: CalendarEvent[];
  selectedFilters: string[] = [];
  refresh: Subject<any> = new Subject(); // used for drag and resize functionalities

  constructor(public scheduleFsService: ScheduleFirestoreService,
              public scheduleUtil: ScheduleUtilService,
              public dialog: MatDialog) { }

  ngOnInit() { }

  goToPreviousWeek(): void {
    this.viewDate = subWeeks(this.viewDate, 1);
  }

  goToNextWeek(): void {
    this.viewDate = addWeeks(this.viewDate, 1);
  }

  onChangeToggle(event): void {
    const value: string = event.value;
    console.log('Clicked on filter: ', value);
    if (this.selectedFilters.indexOf(value) >= 0) {
      this.selectedFilters.splice(this.selectedFilters.indexOf(value), 1);
    } else {
      this.selectedFilters.push(value);
    }
    this.reFilterEvents();
  }

  reFilterEvents(): void {
    this.filteredEvents = this.events.filter(i => this.selectedFilters.indexOf(i.meta[this.filteringKey]) >= 0);
  }

  openScheduleInputDialog(editingMode: boolean, day: Date, toDisplay: ScheduleEntry): void {
    const dialogRef = this.dialog.open(ScheduleInputDialogComponent, {
      width: '500px',
      data: {
        settings: this.settings,
        events: this.events,
        editing: editingMode,
        day: startOfDay(day),
        entry: toDisplay
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
        this.reFilterEvents();
      } else {
        console.log('Input dialog was closed without saving');
      }
    });
  }

  addEvent(time): void {
    const startDate: Date = new Date(time);
    console.log('Adding event on ', startDate);
    const nbOfActiveToggles = this.selectedFilters.length;
    const toDisplay = new ScheduleEntry(startDate, addHours(startDate, 1),
      // so that the default event has data from the last activate toggle
      this.filteringKey === 'teacher' && nbOfActiveToggles > 0 ? this.selectedFilters[nbOfActiveToggles - 1] : this.settings.teachers[0],
      this.filteringKey === 'batch' && nbOfActiveToggles > 0 ? this.selectedFilters[nbOfActiveToggles - 1] : this.settings.batches[0],
      this.filteringKey === 'room' && nbOfActiveToggles > 0 ? this.selectedFilters[nbOfActiveToggles - 1] : this.settings.rooms[0],
      null,
      true);
    this.openScheduleInputDialog(false, startDate, toDisplay);
  }

  editEvent({ event }: { event: CalendarEvent }): void {
    console.log('Modifying event with ID: ', event.meta.id);
    this.openScheduleInputDialog(true, event.start, new ScheduleEntry(event.start, event.end,
      event.meta.teacher, event.meta.batch, event.meta.room, event.meta.subject, event.meta.recurring, event.meta.id),
    );
  }

  // for drag and resize
  modifyEventTimes({ event, newStart, newEnd }: CalendarEventTimesChangedEvent): void {

    const originalStart = event.start; // for rollback in case of database error
    const originalEnd = event.end;

    const modifiedEntry = new ScheduleEntry(newStart, newEnd, event.meta.teacher,
      event.meta.batch, event.meta.room, event.meta.subject, event.meta.recurring, event.meta.id);

    const conflictError = this.scheduleUtil.getConflictError(modifiedEntry, this.events);
    if (conflictError) {
      this.dialog.open(ErrorMessageDialogComponent, {
        width: '500px',
        data: {
          header: 'Conflict found',
          errorMessage: conflictError.message
        }
      });
    } else {
      console.log('No conflict found. Updating database...');
      event.start = newStart;
      event.end = newEnd;
      this.scheduleFsService.updateScheduleEvent(modifiedEntry.id, {
        from: modifiedEntry.from,
        to: modifiedEntry.to
      })
        .then(res => {
          console.log('Success');
          this.refresh.next();
        })
        .catch(error => {
          event.start = originalStart;
          event.end = originalEnd;
          console.warn(error._body);
          this.dialog.open(ErrorMessageDialogComponent, {
            width: '500px',
            data: {
              header: 'Technical error',
              errorMessage: 'Could not perform update in database'
            }
          });
        });
    }
  }
}
