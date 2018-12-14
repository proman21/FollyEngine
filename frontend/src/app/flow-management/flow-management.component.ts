import { Component, OnInit, ViewChild } from "@angular/core";
import { DesignerFlow } from '../designer/designer';
import { DesignerService } from '../designer/designer.service';
import { FlowEditorComponent } from './flow-editor/flow-editor.component';

@Component({
  selector: 'flow-management',
  templateUrl: './flow-management.component.html',
  styleUrls: ['./flow-management.component.css']
})
export class FlowManagementComponent implements OnInit {
  title = 'Real Designer';
  flows: Map<number, DesignerFlow> = new Map();
  searchData: Map<number, string> = new Map();
  selectedIndex = 0;

  constructor(private designerService: DesignerService) {}

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
    this.flows = new Map(
      [...Array.from(this.flows.entries())].sort(function(a, b) {
        return a[1].name.localeCompare(b[1].name);
      })
    );

    for (const entry of Array.from(this.flows.entries())) {
      this.searchData.set(entry[0], entry[1].name);
    }
  }

  getSelected() {
    return this.flows.get(this.selectedIndex);
  }

  newFlow() {
    const flow = new DesignerFlow('New Flow');
    this.designerService.registerNewFlow(flow).then(() => this.subscribeDesigner());
  }

  changeName(name: string) {
    this.getSelected().name = name;
    this.refreshSearchList();
    this.subscribeDesigner();
  }

  destroySelected() {
    this.designerService.destroyFlow(this.getSelected().id);
    this.refreshSearchList();
    this.subscribeDesigner();
  }

  selectFlow(event: number) {
    this.selectedIndex = event;
  }
}