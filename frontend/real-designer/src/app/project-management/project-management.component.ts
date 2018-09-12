import { Component, Input, Output, EventEmitter } from '@angular/core';
import { WelcomeDialogComponent } from './welcome-dialog/welcome-dialog.component';
import { SettingsDialogComponent } from './settings-dialog/settings-dialog.component';
import { MenubarComponent } from './menubar/menubar.component';

// Angular Material
import { MatDialog, MatDialogConfig } from "@angular/material";

@Component({
  selector: 'project-management',
  templateUrl: './project-management.component.html',
  styleUrls: ['./project-management.component.css']
})
export class ProjectManagementComponent {
    @Input() workspace: number;
    @Input() username: string;
    @Input() projectName: string;

    // Default Values
    _username: string = sessionStorage.getItem('username');
    _projectName: string = 'Untitled';

    constructor(public dialog: MatDialog) {}

    ngOnInit() {
        if (this.username) {
            this._username = this.username;
        }
        if (this.projectName) {
            this._projectName = this.projectName;
        }
    }

    displayWelcomeDialog(callback) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = false;
        dialogConfig.minWidth = 800;
        dialogConfig.minHeight = 600;
        dialogConfig.hasBackdrop = true;
        let dialogRef = this.dialog.open(WelcomeDialogComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(() => {
            this._projectName = dialogRef.componentInstance.projectName.value;
            callback(); // Hack fix I'm laqzy
        });
    }

    displaySettingsDialog() {
        const settingsDialogConfig = new MatDialogConfig();
        settingsDialogConfig.disableClose = true;
        settingsDialogConfig.autoFocus = false;
        settingsDialogConfig.minWidth = 800;
        settingsDialogConfig.minHeight = 600;
        settingsDialogConfig.hasBackdrop = true;
        let settingsDialogRef = this.dialog.open(SettingsDialogComponent, settingsDialogConfig);
        settingsDialogRef.afterClosed().subscribe(() => {
            // TODO: Save settings changes after close
        });
    }

    @Output() onSave = new EventEmitter<string>();
    save() {
        this.onSave.emit();
    }

    @Output() onToggleSideBar = new EventEmitter<string>();
    toggleSideBar() {
        this.onToggleSideBar.emit();
    }

    makeNewProject() {
        this.displayWelcomeDialog(undefined);
    }

    @Output() onMakeNewEntity = new EventEmitter<string>();
    makeNewEntity() {
        this.onMakeNewEntity.emit();
    }

    @Output() onMakeNewComponent = new EventEmitter<string>();
    makeNewComponent() {
        this.onMakeNewComponent.emit();
    }

    @Output() onAddNewAction = new EventEmitter<string>();
    addNewAction() {
        this.onAddNewAction.emit();
    }

    @Output() onAddNewTrigger = new EventEmitter<string>();
    addNewTrigger() {
        this.onAddNewTrigger.emit();
    }

    @Output() onAddNewCondition = new EventEmitter<string>();
    addNewCondition() {
        this.onAddNewCondition.emit();
    }

    @Output() onAddNewOperation = new EventEmitter<string>();
    addNewOperation() {
        this.onAddNewOperation.emit();
    }

    @Output() onAddNewNestedFlow = new EventEmitter<string>();
    addNewNestedFlow() {
        this.onAddNewNestedFlow.emit();
    }

}
