import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Animation and Angular Material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './../material.module';

// Components
import { LoginScreenComponent } from './login-screen.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MaterialModule,
  ],
  exports: [
      LoginScreenComponent
  ],
  declarations: [
      LoginScreenComponent
  ]
})
export class LoginScreenModule { }
