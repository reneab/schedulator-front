import { Component, OnInit, Input } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { addHours, startOfDay, addWeeks, subWeeks } from 'date-fns';
import { MatDialog } from '@angular/material';
import { ScheduleInputDialogComponent } from '../schedule-input-dialog/schedule-input-dialog.component';
import { ScheduleEntry } from '../ScheduleEntry';

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

  // TODO: create toggle button to make filtering exclusive or multiple

  viewDate: Date = new Date();

  filteredEvents: CalendarEvent[];
  // = [
  //    {
  //     start: addHours(startOfDay(new Date()), 8),
  //     end: addHours(startOfDay(addDays(new Date(), 1)), 10),
  //     title: '<b>Web</b>, Ean Velayo, LB442',
  //     color: colors.blue,
  //     resizable: {
  //       beforeStart: false,
  //       afterEnd: true
  //     },
  //     draggable: true
  //   },
  // ];

  selectedFilters: string[] = [];

  constructor(public dialog: MatDialog) { }

  ngOnInit() { }

  goToPreviousWeek(): void {
    this.viewDate = addWeeks(this.viewDate, 1);
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

  openScheduleInputDialog(editingMode: boolean, day: Date, data: ScheduleEntry): void {
    const dialogRef = this.dialog.open(ScheduleInputDialogComponent, {
      width: '500px',
      data: {
        settings: this.settings,
        events: this.events,
        editing: editingMode,
        day: startOfDay(day),
        entry: data
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
    this.openScheduleInputDialog(false, startDate, new ScheduleEntry(startDate, addHours(startDate, 1),
      this.settings.teachers[0], this.settings.batches[0], this.settings.rooms[0], null, true),
    );
  }

  modifyEvent({ event }: { event: CalendarEvent }): void {
    console.log('Modifying event with ID: ', event.meta.id);
    this.openScheduleInputDialog(true, event.start, new ScheduleEntry(event.start, event.end,
      event.meta.teacher, event.meta.batch, event.meta.room, event.meta.subject, event.meta.recurring, event.meta.id),
    );
  }
}
