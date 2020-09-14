import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './views/home/home.component';
import { RideShareComponent } from './views/rideshare/rideshare.component'; 
import { LoginComponent } from './views/login/login.component'; 
import { SignupComponent } from './views/signup/signup.component'; 
import { ClubsComponent } from './views/clubs/clubs.component'; 
import { EventsComponent } from './views/events/events.component'; 

const routes: Routes = [

  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'rideshare', component: RideShareComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'clubs', component: ClubsComponent },
  { path: 'events', component: EventsComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
