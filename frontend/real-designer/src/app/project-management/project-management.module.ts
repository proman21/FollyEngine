import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Components
import { ProjectManagementComponent } from './project-management.component';
import { WelcomeDialogComponent } from './welcome-dialog/welcome-dialog.component';
import { MenubarComponent } from './menubar/menubar.component';
import { MaterialModule } from './../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SettingsDialogComponent } from './settings-dialog/settings-dialog.component';
import { SettingsPersonalComponent } from './settings-dialog/settings-personal/settings-personal.component';
import { SettingsNotificationsComponent } from './settings-dialog/settings-notifications/settings-notifications.component';

// Services

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
  	ProjectManagementComponent
  ],
  declarations: [
  	ProjectManagementComponent,
  	WelcomeDialogComponent,
  	MenubarComponent,
  	SettingsDialogComponent,
  	SettingsPersonalComponent,
  	SettingsNotificationsComponent
  ],
  entryComponents: [
      WelcomeDialogComponent,
      SettingsDialogComponent
  ]
})
export class ProjectManagementModule { }
