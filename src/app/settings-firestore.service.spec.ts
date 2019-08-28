import { TestBed } from '@angular/core/testing';

import { SettingsFirestoreService } from './settings-firestore.service';

describe('SettingsFirestoreService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SettingsFirestoreService = TestBed.get(SettingsFirestoreService);
    expect(service).toBeTruthy();
  });
});
