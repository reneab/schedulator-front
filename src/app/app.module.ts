import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { HttpModule } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule, MatSelectModule, MatButtonModule, MatToolbarModule,
  MatDialogModule, MatTooltipModule, MatFormFieldModule, MatSlideToggleModule,
  MatChipsModule, MatIconModule, MatTabsModule, MatButtonToggleModule } from '@angular/material';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ScheduleInputDialogComponent } from './schedule-input-dialog/schedule-input-dialog.component';
import { ErrorMessageDialogComponent } from './error-message-dialog/error-message-dialog.component';
import { SettingsComponent } from './settings/settings.component';
import { ScheduleTableComponent } from './schedule-table/schedule-table.component';
import { RouterModule, Routes } from '@angular/router';

import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { CalendarComponent } from './calendar/calendar.component';

const appRoutes: Routes = [
  { path: '', component: ScheduleTableComponent },
  { path: 'settings', component: SettingsComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    ScheduleInputDialogComponent,
    ErrorMessageDialogComponent,
    SettingsComponent,
    ScheduleTableComponent,
    CalendarComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    RouterModule.forRoot(appRoutes),
    HttpModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatToolbarModule,
    MatDialogModule,
    MatTooltipModule,
    MatChipsModule,
    MatIconModule,
    MatTabsModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatButtonToggleModule
  ],
  entryComponents: [ScheduleInputDialogComponent, ErrorMessageDialogComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
