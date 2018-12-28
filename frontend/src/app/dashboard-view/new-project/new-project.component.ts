import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { MatDialogRef } from "@angular/material";

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.css']
})
export class NewProjectComponent {
  projectForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('')
  });

  get title() {
    return this.projectForm.get('title');
  }

  get description() {
    return this.projectForm.get('description');
  }

  constructor(private dialogRef: MatDialogRef<NewProjectComponent>) { }

  createNewProject() {
    if (this.projectForm.valid) {
      this.dialogRef.close(this.projectForm.value);
    } else {
      this.projectForm.markAsTouched();
    }
  }
}
