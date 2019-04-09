import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-schedule-tile',
  templateUrl: './schedule-tile.component.html',
  styleUrls: ['./schedule-tile.component.less']
})
export class ScheduleTileComponent implements OnInit {

  @Input() id: string; // of the schedule entry
  // attributes to be displayed in the top, middle and bottom of the tile
  @Input() top: string;
  @Input() middle: string;
  @Input() bottom: string;

  @Output() deleteSuccessEvent = new EventEmitter();
  @Output() deleteFailEvent = new EventEmitter<string>();

  isHovering = false;

  constructor(private dataService: DataService) { }

  ngOnInit() {
  }

  private delete = function(id: string) {
    this.dataService.deleteScheduleElement(id)
    .subscribe(res => {
      console.log(res);
      this.deleteSuccessEvent.emit();
    }, error => {
      const message = error._body;
      console.log(message);
      this.deleteFailEvent.emit(message);
    });
  };

}
