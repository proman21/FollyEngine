import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Components
import { FlowManagementComponent } from './flow-management.component';
import { FlowEditorComponent } from './flow-editor/flow-editor.component';

// Libs

// Services
import { FlowNodeService } from './flow-node/flow-node.service';

// Module
import { MaterialModule } from './../material.module';
import { SharedUiModule } from '../shared-ui/shared-ui.module';

@NgModule({
  imports: [
    CommonModule,
    SharedUiModule,
    MaterialModule
  ],
  exports: [
    FlowManagementComponent,
  ],
  declarations: [
  	FlowManagementComponent,
  	FlowEditorComponent
  ],
  providers: [
    FlowNodeService
  ]
})
export class FlowManagementModule { }
