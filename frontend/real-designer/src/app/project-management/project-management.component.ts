import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DesignerService } from '../designer/designer.service';
import { WelcomeDialogComponent } from './welcome-dialog/welcome-dialog.component';
import { SettingsDialogComponent } from './settings-dialog/settings-dialog.component';
import { MenubarComponent } from './menubar/menubar.component';
import { EntityManagementComponent } from '../entity-management/entity-management.component';
import { ComponentManagementComponent } from '../component-management/component-management.component';
import { FlowManagementComponent } from '../flow-management/flow-management.component';
import { AssetManagementComponent } from '../asset-management/asset-management.component';

// Angular Material
import { MatDialog, MatDialogConfig } from '@angular/material';

@Component({
  selector: 'project-management',
  templateUrl: './project-management.component.html',
  styleUrls: ['./project-management.component.css']
})
export class ProjectManagementComponent {
  id: number;
  view: number = 0;

  // Default Values
  username: string = sessionStorage.getItem('username');
  projectName = 'Untitled';
  
  bindingVar = '';

  constructor(private designerService: DesignerService, private route: ActivatedRoute, private router: Router, public dialog: MatDialog) {
    designerService.loadAllProjects().then(() => {
      route.params.subscribe(({id}) => {
        if (id) {
          designerService.loadProject(id).then(() => {
            this.id = id;
          });
        } else {
          this.displayWelcomeDialog();
        }
      });
    });
  }

  ngOnInit() {
    this.username = this.username;
    this.projectName = this.projectName;
  }

  setView(val: number) {
    this.view = val;
    this.fadeIn();
  }
  
  fadeIn() {
    this.bindingVar = 'fadeIn';
  }

  displayWelcomeDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.minWidth = 800;
    dialogConfig.minHeight = 600;
    dialogConfig.hasBackdrop = true;
    const dialogRef = this.dialog.open(WelcomeDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(() => {
      this.projectName = dialogRef.componentInstance.projectName.value;
      this.router.navigate(['projects', dialogRef.componentInstance.projectId]);
    });
  }

  displaySettingsDialog() {
    const settingsDialogConfig = new MatDialogConfig();
    settingsDialogConfig.disableClose = true;
    settingsDialogConfig.autoFocus = false;
    settingsDialogConfig.minWidth = 800;
    settingsDialogConfig.minHeight = 600;
    settingsDialogConfig.hasBackdrop = true;
    const settingsDialogRef = this.dialog.open(SettingsDialogComponent, settingsDialogConfig);
    settingsDialogRef.afterClosed().subscribe(() => {
      // TODO: Save settings changes after close
    });
  }

  makeNewProject() {
    this.displayWelcomeDialog();
  }

  // Makes a new entity in the entity manager
  @ViewChild(EntityManagementComponent)
  entityManagement: EntityManagementComponent;
  makeNewEntity() {
    this.entityManagement.newEntity();
  }

  // Makes a new component in the component manager
  @ViewChild(ComponentManagementComponent)
  componentManagement: ComponentManagementComponent;
  makeNewComponent() {
    this.componentManagement.newComponent();
  }

  @ViewChild(FlowManagementComponent)
  flowManagement: FlowManagementComponent;
  addNewAction() {
    this.flowManagement.newAction();
  }
  addNewTrigger() {
    this.flowManagement.newTrigger();
  }
  addNewCondition() {
    this.flowManagement.newCondition();
  }
  addNewOperation() {
    this.flowManagement.newOperation();
  }
  addNewNestedFlow() {
    this.flowManagement.newNestedFlow();
  }
}
