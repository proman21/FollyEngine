import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Components
import { ProjectManagementComponent } from './project-management.component';
import { WelcomeDialogComponent } from './welcome-dialog/welcome-dialog.component';
import { MenubarComponent } from './menubar/menubar.component';
import { MaterialModule } from './../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SettingsDialogComponent } from './settings-dialog/settings-dialog.component';
import { SettingsPersonalComponent } from './settings-dialog/settings-personal/settings-personal.component';
import { SettingsNotificationsComponent } from './settings-dialog/settings-notifications/settings-notifications.component';
import { EntityManagementModule } from '../entity-management/entity-management.module';
import { ComponentManagementModule } from '../component-management/component-management.module';
import { FlowManagementModule } from '../flow-management/flow-management.module';
import { AssetManagementModule } from '../asset-management/asset-management.module';

// Services

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    EntityManagementModule,
    ComponentManagementModule,
    FlowManagementModule,
    AssetManagementModule
  ],
  exports: [ProjectManagementComponent],
  declarations: [
    ProjectManagementComponent,
    WelcomeDialogComponent,
    MenubarComponent,
    SettingsDialogComponent,
    SettingsPersonalComponent,
    SettingsNotificationsComponent
  ],
  entryComponents: [WelcomeDialogComponent, SettingsDialogComponent]
})
export class ProjectManagementModule {}
