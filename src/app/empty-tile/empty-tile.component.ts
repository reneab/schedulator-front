import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ScheduleInputDialogComponent } from '../schedule-input-dialog/schedule-input-dialog.component';

@Component({
  selector: 'app-empty-tile',
  templateUrl: './empty-tile.component.html',
  styleUrls: ['./empty-tile.component.less']
})
export class EmptyTileComponent implements OnInit {

  @Input() settings: any;
  @Input() timeslot: string;

  @Output() saveSuccessEvent = new EventEmitter();

  isHovering = false;

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

  openScheduleInputDialog(): void {
    const dialogRef = this.dialog.open(ScheduleInputDialogComponent, {
      height: '500px',
      width: '600px',
      data: {
        settings: this.settings,
        timeslot: this.timeslot}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.saveSuccessEvent.emit();
      } else {
        console.log('The dialog was closed without saving');
      }
    });
  }

}
