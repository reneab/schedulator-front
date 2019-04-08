import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ScheduleInputDialogComponent } from '../schedule-input-dialog/schedule-input-dialog.component';

@Component({
  selector: 'app-empty-tile',
  templateUrl: './empty-tile.component.html',
  styleUrls: ['./empty-tile.component.less']
})
export class EmptyTileComponent implements OnInit {

  isHovering = false;

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

  openScheduleInputDialog(): void {
    const dialogRef = this.dialog.open(ScheduleInputDialogComponent, {
      height: '100px',
      width: '200px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // TODO refresh schedules
    });
  }

}
