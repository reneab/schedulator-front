import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleTileComponent } from './schedule-tile.component';

describe('ScheduleTileComponent', () => {
  let component: ScheduleTileComponent;
  let fixture: ComponentFixture<ScheduleTileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduleTileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
