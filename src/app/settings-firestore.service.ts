import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsFirestoreService {

  settingsCollRef: AngularFirestoreCollection<any>;

  constructor(public fs: AngularFirestore) {
    this.settingsCollRef = fs.collection(environment.firebase.firestore.settingsCollection);
  }

  getSettings(): Observable<any> {
    return this.settingsCollRef.doc(environment.firebase.firestore.settingsDocument).valueChanges();
  }

  updateSettings(settings: any): Promise<any> {
    return this.settingsCollRef.doc(environment.firebase.firestore.settingsDocument).update(settings);
  }

}
