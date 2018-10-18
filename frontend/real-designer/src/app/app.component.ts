import { Component, ViewChild } from '@angular/core';
import { ProjectManagementComponent } from './project-management/project-management.component';
import { EntityManagementComponent } from './entity-management/entity-management.component';
import { ComponentManagementComponent } from './component-management/component-management.component';
import { FlowManagementComponent } from './flow-management/flow-management.component';
import { trigger, transition, style, animate, stagger } from '@angular/animations';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';

import { DesignerService } from './designer/designer.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('fadeInAnimation', [
      transition('* => fadeIn', [
        style({
          color: '#abc',
          opacity: 0
        }),

        animate(600, style({ opacity: 1 }))
      ])
    ])
  ]
})
export class AppComponent {
  title = 'Real Designer';
  login: number;
  menu = false;
  sidebarExpanded: boolean;
  bindingVar = '';
  fadeIn() {
    this.bindingVar = 'fadeIn';
  }

  username: string;
  projectName: string;

  @ViewChild(ProjectManagementComponent)
  projectManagement: ProjectManagementComponent;

  constructor(private designerService: DesignerService, public snackBar: MatSnackBar) {
    //this.view = 0;
    this.login = 0;
    this.sidebarExpanded = true;

    if (sessionStorage.getItem('username') == 'Guest') {
      sessionStorage.removeItem('username');
    }

    if (typeof sessionStorage.getItem('username') !== 'undefined' && sessionStorage.getItem('username') !== null) {
      //this.setLogin(2);
    }
  }

  setLogin(val: number) {
    this.login = val;
    const self = this;

    // Peak laziness
    if (val == 2) {
      this.designerService.loadAllProjects();
      self.menu = true;
      setTimeout(
        () =>
          this.projectManagement.displayWelcomeDialog(function() {
            self.login = 1;
          }),
        1
      );
    }
  }

  toggleSideBar() {
    this.sidebarExpanded = !this.sidebarExpanded;
  }

  save() {
    this.designerService.saveState();
    this.displayAlert('Save Successful', 'OK', 1500); // lol
  }

  displayAlert(message: string, action: string, duration: number) {
    const config = new MatSnackBarConfig();
    config.duration = duration;
    config.panelClass = ['alert-bar'];
    this.snackBar.open(message, action, config);
  }
}
