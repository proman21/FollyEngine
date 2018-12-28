import { Component} from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";
import { Validators } from '@angular/forms';

import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { SessionService } from "../auth/auth.service";

@Component({
  selector: 'login-screen',
  templateUrl: './login-screen.component.html',
  styleUrls: ['./login-screen.component.css']
})
export class LoginScreenComponent {
  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  get username() { return this.loginForm.get('username'); }

  get password() { return this.loginForm.get('password'); }

  public constructor(
    private domSanitizer: DomSanitizer,
    private router: Router,
    private authService: SessionService
  ) {}

  // Variables
  welcomeName = 'Guest'; // The name displayed when logging in

  signIn() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe(() => {
        this.router.navigate(['/projects']);
      }, err => {
        console.log(err);
      })
    } else {
      // show errors
      this.loginForm.markAsTouched();
    }
  }

  /* Transition */

  // If login or create account is successful, transition out of the login screen
  transition() {
    const loginScreen = this;

    // Show loading indicator
    document.getElementById('loading').style.display = 'block';
    // Fade out controls
    document.getElementById('content').style.transition = '0.5s';
    document.getElementById('content').style.opacity = '0';

    // Hide the controls after fading
    setTimeout(function() {
      document.getElementById('content').style.display = 'none';
    }, 500);

    // After loading for a bit, hide the login-screen
    setTimeout(function() {
      document.getElementById('login-view').style.transition = '0.5s';
      document.getElementById('login-view').style.opacity = '0';
    }, 1500);
  }
}
