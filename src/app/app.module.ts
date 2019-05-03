import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { HttpModule } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule, MatSelectModule, MatButtonModule, MatToolbarModule,
  MatDialogModule, MatTooltipModule,
  MatChipsModule, MatIconModule, MatTabsModule } from '@angular/material';
import { DataService } from './data.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ScheduleTileComponent } from './schedule-tile/schedule-tile.component';
import { EmptyTileComponent } from './empty-tile/empty-tile.component';
import { ScheduleInputDialogComponent } from './schedule-input-dialog/schedule-input-dialog.component';
import { ErrorMessageDialogComponent } from './error-message-dialog/error-message-dialog.component';
import { SettingsComponent } from './settings/settings.component';
import { ScheduleTableComponent } from './schedule-table/schedule-table.component';
import { RouterModule, Routes } from '@angular/router';

const appRoutes: Routes = [
  { path: '', component: ScheduleTableComponent },
  { path: 'settings', component: SettingsComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    ScheduleTileComponent,
    EmptyTileComponent,
    ScheduleInputDialogComponent,
    ErrorMessageDialogComponent,
    SettingsComponent,
    ScheduleTableComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    RouterModule.forRoot(appRoutes),
    HttpModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatToolbarModule,
    MatDialogModule,
    MatTooltipModule,
    MatChipsModule,
    MatIconModule,
    MatTabsModule
  ],
  entryComponents: [ScheduleInputDialogComponent, ErrorMessageDialogComponent],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
