import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-schedule-tile',
  templateUrl: './schedule-tile.component.html',
  styleUrls: ['./schedule-tile.component.less']
})
export class ScheduleTileComponent implements OnInit {

  @Input() id: string;
  @Input() room: string;
  @Input() teacher: string;
  @Input() subject: string;

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
