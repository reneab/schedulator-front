import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { HttpModule } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule, MatSelectModule, MatButtonModule, MatToolbarModule, 
  MatListModule, MatCardModule, MatDividerModule } from '@angular/material';
import { DataService } from './data.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ScheduleFilterPipe } from './ScheduleFilterPipe';

@NgModule({
  declarations: [
    AppComponent,
    ScheduleFilterPipe
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
    MatDividerModule
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
