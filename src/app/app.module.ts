import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { HttpModule } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule, MatSelectModule, MatButtonModule, MatToolbarModule,
  MatListModule, MatCardModule, MatDividerModule, MatDialogModule, MatTooltipModule } from '@angular/material';
import { DataService } from './data.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ScheduleFilterPipe } from './ScheduleFilterPipe';
import { ScheduleTileComponent } from './schedule-tile/schedule-tile.component';
import { EmptyTileComponent } from './empty-tile/empty-tile.component';
import { ScheduleInputDialogComponent } from './schedule-input-dialog/schedule-input-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    ScheduleFilterPipe,
    ScheduleTileComponent,
    EmptyTileComponent,
    ScheduleInputDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatToolbarModule,
    MatListModule,
    MatCardModule,
    MatDividerModule,
    MatDialogModule,
    MatTooltipModule
  ],
  entryComponents: [ScheduleInputDialogComponent],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
