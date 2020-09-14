import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent { 
  name = "";
  email = "";
  password = "";
  password2 = "";
  errorMsg = "";

  constructor(private authSvc: AuthService, private router: Router) {}

  signup()
  {    
    this.errorMsg = "";
    if (this.password != this.password2)
    {
      this.errorMsg = "Passwords must match";
      return;
    }
    this.authSvc.signup(this.email, this.password, this.name)
      .catch(error => this.errorMsg = error.message);
  }

  goToLogin()
  {
    this.router.navigateByUrl('login');
  }



}
