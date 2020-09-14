import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent { 
email: string;
password: string;
errorMsg: string;
currView = 1;
views = {login: 1, forgotpassword: 2, emailsent: 3}

  constructor(private authSvc: AuthService, private router: Router) {}

  login()
  {    
    this.errorMsg = "";
    this.authSvc.login({ email: this.email, password: this.password})
      .catch(error => this.errorMsg = error.message);
  }

  register()
  {    
    this.router.navigateByUrl('signup');
  }

  sendForgotEmail()
  {
    this.authSvc.passwordReset(this.email)
      .then(() => {
        this.errorMsg = "";
        alert("Instructions on how to reset your password have been email to you.")
        this.currView = this.views.login;
      })
      .catch(error => this.errorMsg = error.message);
  }



}
