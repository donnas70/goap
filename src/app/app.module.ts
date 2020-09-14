import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { FormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';
import { NgModule } from '@angular/core';
import { environment } from '../environments/environment';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { FullCalendarModule } from '@fullcalendar/angular'; // for FullCalendar!

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { DataService } from './services/data.service';
import { FireService } from './services/fire.service';
import { AuthService } from './services/auth.service';

import { HomeComponent } from './views/home/home.component'; 
import { RideShareComponent, FilterDialogComponent } from './views/rideshare/rideshare.component'; 
import { LoginComponent } from './views/login/login.component'; 
import { SignupComponent } from './views/signup/signup.component'; 
import { ClubsComponent, SuggestClubDialogComponent } from './views/clubs/clubs.component'; 
import { EventsComponent, SuggestEventDialogComponent } from './views/events/events.component'; 
/* import { database } from 'firebase'; */

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    SignupComponent,
    ClubsComponent,
    EventsComponent,
    RideShareComponent,
    SuggestClubDialogComponent,
    SuggestEventDialogComponent,
    FilterDialogComponent
  ],
  entryComponents: [
    SuggestClubDialogComponent,
    SuggestEventDialogComponent,
    FilterDialogComponent
],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    MaterialModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    FullCalendarModule // for FullCalendar!
  ],
  providers: [
    DataService,
    FireService,
    AuthService
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
