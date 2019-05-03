import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ScheduleInputDialogComponent } from '../schedule-input-dialog/schedule-input-dialog.component';
import { ScheduleEntry } from '../ScheduleEntry';

@Component({
  selector: 'app-schedule-tile',
  templateUrl: './schedule-tile.component.html',
  styleUrls: ['./schedule-tile.component.less']
})
export class ScheduleTileComponent implements OnInit {

  @Input() entry: ScheduleEntry;
  @Input() settings: any;

  // attributes to be displayed in the top, middle and bottom of the tile
  @Input() top: string;
  @Input() middle: string;
  @Input() bottom: string;

  @Output() saveSuccessEvent = new EventEmitter();

  isHovering = false;

  constructor(public dialog: MatDialog) { }

  ngOnInit() { }

  openScheduleInputDialog(): void {
    const dialogRef = this.dialog.open(ScheduleInputDialogComponent, {
      height: '500px',
      width: '600px',
      data: {
        settings: this.settings,
        editing: true,
        entry: this.entry
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.saveSuccessEvent.emit();
      } else {
        console.log('Input dialog was closed without saving');
      }
    });
  }

}
