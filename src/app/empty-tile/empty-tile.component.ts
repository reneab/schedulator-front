import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-empty-tile',
  templateUrl: './empty-tile.component.html',
  styleUrls: ['./empty-tile.component.less']
})
export class EmptyTileComponent implements OnInit {

  isHovering = false;

  constructor() { }

  ngOnInit() {
  }

}
