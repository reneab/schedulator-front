import { TestBed } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';

import { SettingsFirestoreService } from './settings-firestore.service';

const AngularFirestoreStub = {
  collection: (name) => [{ to: new Date(), from: new Date(), title: 'No one cares' }]
};

describe('SettingsFirestoreService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      { provide: AngularFirestore, useValue: AngularFirestoreStub }
    ]
  }));

  it('should be created', () => {
    const service: SettingsFirestoreService = TestBed.get(SettingsFirestoreService);
    expect(service).toBeTruthy();
  });
});
