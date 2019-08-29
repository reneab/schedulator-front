import { TestBed } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';
import { ScheduleFirestoreService } from './schedule-firestore.service';

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
    const service: ScheduleFirestoreService = TestBed.get(ScheduleFirestoreService);
    expect(service).toBeTruthy();
  });
});
