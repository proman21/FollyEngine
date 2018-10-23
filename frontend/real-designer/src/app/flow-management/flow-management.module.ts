import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Components
import { FlowManagementComponent } from './flow-management.component';
import { FlowEditorComponent } from './flow-editor/flow-editor.component';
import { ConditionNodeComponent } from './flow-node/condition-node.component';
import { OperationNodeComponent } from './flow-node/operation-node.component';
import { ActionNodeComponent } from './flow-node/action-node.component';
import { TriggerNodeComponent } from './flow-node/trigger-node.component';
import { NestedFlowNodeComponent } from './flow-node/nested-flow-node.component';
import { AttributeInputComponent } from './flow-node/attribute-input.component';
import { AssetInputComponent } from './flow-node/asset-input.component';

// Libs

// Services
import { FlowNodeService } from './flow-node/flow-node.service';

// Module
import { MaterialModule } from './../material.module';
import { SharedUiModule } from '../shared-ui/shared-ui.module';
import { InstanceNodeComponent } from './flow-node/instance-node.component';
import { GateNodeComponent } from './flow-node/gate-node.component';
import { StartNodeComponent } from './flow-node/start-node.component';
import { EndNodeComponent } from './flow-node/end-node.component';

@NgModule({
  imports: [CommonModule, FormsModule, SharedUiModule, MaterialModule],
  exports: [FlowManagementComponent],
  declarations: [
    FlowManagementComponent,
    FlowEditorComponent,
    ConditionNodeComponent,
    OperationNodeComponent,
    ActionNodeComponent,
    TriggerNodeComponent,
    NestedFlowNodeComponent,
    AttributeInputComponent,
    AssetInputComponent,
    InstanceNodeComponent,
    GateNodeComponent,
    StartNodeComponent,
    EndNodeComponent
  ],
  providers: [FlowNodeService],
  entryComponents: [
    ConditionNodeComponent,
    OperationNodeComponent,
    ActionNodeComponent,
    TriggerNodeComponent,
    NestedFlowNodeComponent,
    InstanceNodeComponent,
    GateNodeComponent,
    StartNodeComponent,
    EndNodeComponent
  ]
})
export class FlowManagementModule {}
