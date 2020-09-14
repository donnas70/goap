import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { User } from '../models/user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  actionCodeSettings = { url: environment.loginurl, handleCodeInApp: true };
  constructor(private afAuth: AngularFireAuth, private db: AngularFireDatabase, private router: Router) {}

   login(user: User) { 
     return this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password)
      .then(resolve => {
          const status = 'online';
          this.setUserStatus(resolve.user.uid, status);  
          this.router.navigateByUrl('rideshare')}
        );
   }

   logout() {
     return this.afAuth.auth.signOut();     
   }

   passwordReset(email)
   {
      return this.afAuth.auth.sendPasswordResetEmail(email, this.actionCodeSettings);
   }

   signup(email, password, name)
   {
    
      return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
        .then((user) => {
          const status = 'online';            
          this.createUserData(user.user.uid, email, name, status);                  
          user.user.sendEmailVerification(this.actionCodeSettings)
              .then(() => 
              {
                  alert("In order to use notifications on this site, we've sent a link to " + email + ". Please use the link to verify your email address.");
                  this.afAuth.auth.signInWithEmailAndPassword(email, password)
                    .then(() => { 
                      this.router.navigateByUrl('rideshare') 
                  });
              });            
            
        });
   }

   createUserData(uid,email, name, status):void
   {     
      const path = 'users/' + uid;
      const data = {
        email: email,
        name: name,
        status: status
      };

      this.db.object(path).set(data);
   }

   setUserStatus(uid, status):void
   {
      const path = 'users/' + uid;
      const data = {
        status: status
      };

      this.db.object(path).update(data);
   }




}

  
  

