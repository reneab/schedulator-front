import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, QuerySnapshot } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScheduleFirestoreService {

  eventsCollRef: AngularFirestoreCollection<any>;

  constructor(public fs: AngularFirestore) {
    this.eventsCollRef = fs.collection(environment.firebase.firestore.schedulesCollection);
  }

  getScheduleEvents(): Observable<any> {
    return this.eventsCollRef.snapshotChanges();
  }

  getEventsAsSnapshot(): Observable<QuerySnapshot<any>> {
    return this.eventsCollRef.get();
  }

  createScheduleEvent(element): Promise<any> {
    return this.eventsCollRef.add(element);
  }

  updateScheduleEvent(id: string, element: any): Promise<any> {
    return this.eventsCollRef.doc(id).update(element);
  }

  deleteScheduleEvent(id: string): Promise<any> {
    return this.eventsCollRef.doc(id).delete();
  }

}
