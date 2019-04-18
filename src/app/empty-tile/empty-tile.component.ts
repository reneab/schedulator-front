import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ScheduleInputDialogComponent } from '../schedule-input-dialog/schedule-input-dialog.component';
import { ScheduleEntry } from '../ScheduleEntry';

@Component({
  selector: 'app-empty-tile',
  templateUrl: './empty-tile.component.html',
  styleUrls: ['./empty-tile.component.less']
})
export class EmptyTileComponent implements OnInit {

  @Input() settings: any;
  @Input() timeslot: string;
  @Input() batch: string;

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
        editing: false,
        entry: new ScheduleEntry(null, this.timeslot, null, this.batch, null, null)
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
