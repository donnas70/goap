import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from "./services/data.service";
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  currentMenu = 0;
  menus = { home: 0, clubs: 1, events: 2, rideshare: 3}  
  showExtMenu=false;
  private user: Observable<firebase.User>;
  
 private subscription: Subscription;  
constructor(private afAuth: AngularFireAuth, private router: Router, private dataSvc: DataService) {  
  this.user = afAuth.authState;
  this.subscription = this.dataSvc.notifyObservable$.subscribe((res) => {
    if (res.hasOwnProperty('option') && res.option === 'updatemenu') {    
      this.currentMenu = res.menuval;        
    }        
  });
}

ngOnInit() {
}

rideshare()
{
  this.currentMenu=this.menus.rideshare;
  this.user.subscribe(user=>{
    if (user==null || user==undefined)
      this.router.navigateByUrl('login');
    else
     this.router.navigateByUrl('rideshare');
  });

}

ngOnDestroy() {
  this.subscription.unsubscribe();
}



}

