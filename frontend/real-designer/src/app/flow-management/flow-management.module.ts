import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Components
import { FlowManagementComponent } from './flow-management.component';
import { FlowEditorComponent } from './flow-editor/flow-editor.component';

// Libs

// Services

@NgModule({
  imports: [
  CommonModule
  ],
  exports: [
  FlowManagementComponent,
  ],
  declarations: [
  	FlowManagementComponent,
  	FlowEditorComponent
  ],
  providers: [
  ]
})
export class FlowManagementModule { }
