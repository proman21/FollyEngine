import { Component, OnInit, Inject, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef,  MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'generic-select-dialog',
    templateUrl: 'generic-select-dialog.html',
})
export class GenericSelectDialog {

    constructor(
        public dialogRef: MatDialogRef<GenericSelectDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    onNoClick(): void {
        this.dialogRef.close();
    }
}