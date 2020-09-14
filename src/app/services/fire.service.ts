import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FireService {

  private _options = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'  }) };

  constructor(private db: AngularFireDatabase, private afAuth: AngularFireAuth, private http: HttpClient) { }

  getClubData(){
    return this.db.list('/clubs').valueChanges();
  }

  getCounties(){
    return this.db.list('/counties').valueChanges();
  }

  getEventData(){
    return this.db.list('/events', ref => { return ref.orderByChild('month_num')}).valueChanges();
  }

  getCalendarData(){
    return this.db.list('/events', ref => { return ref.orderByChild('upcoming').equalTo(true)}).valueChanges();
  }

  getUser(uid)
  {
    return this.db.object('/users/' + uid).valueChanges();
  }

  getUserRideData(){
    return  this.db.list('/user_rides', ref => { return ref.orderByChild('date');}).valueChanges();
  }

  sendEventEmail(data){
   let url = `https://us-central1-goap-8f902.cloudfunctions.net/sendEmail`
  let message = "<p>Date: " + data.eventDate + "</p>";
  message += "<p>Event Name: " + data.eventName + "</p>";
  message += "<p>Location: " + data.location + "</p>";
  message += "<p>url: " + data.url + "</p>";
  message += "<p>Description: " + data.description + "</p>";
   let obj = {subject: 'Event Suggestion', msg: message, to: 'dsteinman70@yahoo.com' };
    return this.http.post(url, obj, this._options );
     
  }

  sendClubEmail(data){
   let url = `https://us-central1-goap-8f902.cloudfunctions.net/sendEmail`
  let message = "<p>Club Name: " + data.clubName + "</p>";
  message += "<p>url: " + data.url + "</p>";
  message += "<p>Description: " + data.description + "</p>";
   let obj = {subject: 'Club Suggestion', msg: message, to: 'dsteinman70@yahoo.com' };
    return this.http.post(url, obj, this._options );
     
  }
}

  
  

