import { TestBed } from '@angular/core/testing';

import { ScheduleFirestoreService } from './schedule-firestore.service';

describe('ScheduleFirestoreService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ScheduleFirestoreService = TestBed.get(ScheduleFirestoreService);
    expect(service).toBeTruthy();
  });
});
