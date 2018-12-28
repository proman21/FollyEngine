import { Component, OnInit, Inject, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'generic-select-dialog',
  templateUrl: 'generic-select-dialog.html'
})
export class GenericSelectDialogComponent {
  constructor(public dialogRef: MatDialogRef<GenericSelectDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}
}
