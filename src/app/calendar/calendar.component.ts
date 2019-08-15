import { Component, OnInit, Input } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { format, addDays, addHours, startOfDay } from 'date-fns';
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

  constructor(public dialog: MatDialog) { }

  ngOnInit() { }

  onChangeToggle(event): void {
    console.log('Changed batch filter to: ' + event.value);
    this.filteredEvents = this.events.filter(i => i.meta.batch === event.value);
  }

  // util function
  openScheduleInputDialog(editingMode: boolean, day: Date, data: ScheduleEntry): void {
    const dialogRef = this.dialog.open(ScheduleInputDialogComponent, {
      height: '550px',
      width: '500px',
      data: {
        settings: this.settings,
        editing: editingMode,
        day: startOfDay(day),
        entry: data
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
      } else {
        console.log('Input dialog was closed without saving');
      }
    });
  }

  addEvent(time): void {
    const startDate: Date = new Date(time);
    console.log('Adding event on ', startDate);
    this.openScheduleInputDialog(false, startDate, new ScheduleEntry(startDate, addHours(startDate, 1),
      this.settings.teachers[0], this.settings.batches[0], this.settings.rooms[0], null),
    );
  }

  modifyEvent({ event }: { event: CalendarEvent }): void {
    console.log('Modifying event with ID: ', event.meta.id);
    this.openScheduleInputDialog(true, event.start, new ScheduleEntry(event.start, event.end,
      event.meta.teacher, event.meta.batch, event.meta.room, event.meta.subject, event.meta.id),
    );
  }
}
