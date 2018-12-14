import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Components
import { FlowManagementComponent } from './flow-management.component';
import { FlowEditorComponent } from './flow-editor/flow-editor.component';
import { ConditionNodeComponent } from './flow-node/condition-node.component';
import { OperationNodeComponent } from './flow-node/operation-node.component';
import { ActionNodeComponent } from './flow-node/action-node.component';
import { TriggerNodeComponent } from './flow-node/trigger-node.component';
import { NestedFlowNodeComponent } from './flow-node/nested-flow-node.component';
import { InstanceNodeComponent } from './flow-node/instance-node.component';
import { GateNodeComponent } from './flow-node/gate-node.component';
import { StartNodeComponent } from './flow-node/start-node.component';
import { EndNodeComponent } from './flow-node/end-node.component';

// Libs

// Services

// Module
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from "../material.module";
import { SharedUiModule } from '../shared-ui/shared-ui.module';
import { SwitchNodeComponent } from './flow-node/switch-node.component';
import { FlowNodeComponent } from './flow-node/flow-node.component';
import { ControlPinComponent } from './flow-node/control-pin/control-pin.component';
import { DataPinComponent } from './flow-node/data-pin/data-pin.component';
import { MatTreeModule } from "@angular/material";

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedUiModule, MaterialModule, MatTreeModule],
  exports: [FlowManagementComponent],
  declarations: [
    FlowManagementComponent,
    FlowEditorComponent,
    ConditionNodeComponent,
    OperationNodeComponent,
    ActionNodeComponent,
    TriggerNodeComponent,
    NestedFlowNodeComponent,
    InstanceNodeComponent,
    GateNodeComponent,
    StartNodeComponent,
    EndNodeComponent,
    SwitchNodeComponent,
    FlowNodeComponent,
    ControlPinComponent,
    DataPinComponent,
  ],
  providers: [],
  entryComponents: [
    FlowNodeComponent
  ]
})
export class FlowManagementModule {}
