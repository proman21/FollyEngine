import { Component, ViewChild } from '@angular/core';
import { DesignerFlow } from '../designer/designer';
import { DesignerService } from '../designer/designer.service';
import { FlowEditorComponent } from './flow-editor/flow-editor.component';

@Component({
  selector: 'flow-management',
  templateUrl: './flow-management.component.html',
  styleUrls: ['./flow-management.component.css']
})
export class FlowManagementComponent {
    title = 'Real Designer';
    flows: Map<number, DesignerFlow> = new Map();
    searchData: Map<number, string> = new Map();
    selectedIndex: number = 0;

    constructor(private designerService: DesignerService) {
    }

    ngOnInit() {
        this.subscribeDesigner();
    }

    subscribeDesigner() {
        // HACK fix
        this.flows = new Map(this.designerService.getFlows());
        this.refreshSearchList();
    }

    refreshSearchList() {
        this.searchData = new Map();

        // Sort our data alphabetically
        this.flows = new Map([...Array.from(this.flows.entries())].sort(function(a, b) {
            return a[1].name.localeCompare(b[1].name);
        }));

        for (let entry of Array.from(this.flows.entries())) {
            this.searchData.set(entry[0], entry[1].name);
        }
    }

    selectFlow(event: number) {
        this.selectedIndex = event;
    }

    newFlow() {
        let flow = new DesignerFlow('New Flow (' + this.flows.size + ')', null);
        this.designerService.registerNewFlow(flow);
        this.subscribeDesigner();
        this.selectFlow(flow.id);
    }

    @ViewChild(FlowEditorComponent) flowEditor: FlowEditorComponent;
    newAction() {
        this.flowEditor.addActionNode();
    }
    newTrigger() {
        this.flowEditor.addTriggerNode();
    }
    newCondition() {
        this.flowEditor.addConditionNode();
    }
    newOperation() {
        this.flowEditor.addOperationNode();
    }
    newNestedFlow() {
        this.flowEditor.addNestedFlowNode();
    }
}
