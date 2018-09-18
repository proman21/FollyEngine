import { Component, OnInit, NgZone } from '@angular/core';
import { DesignerEntity, DesignerComponent, DesignerAttribute } from '../designer/designer';
import { DesignerService } from '../designer/designer.service';

@Component({
  selector: 'component-management',
  templateUrl: './component-management.component.html',
  styleUrls: ['./component-management.component.css']
})
export class ComponentManagementComponent implements OnInit {
  title = 'Real Designer';
  components: Map<number, DesignerComponent> = new Map();
  search_data: Map<number, string> = new Map();
  selected_index = 0;

  constructor(private designerService: DesignerService) {}

  ngOnInit() {
    this.subscribeDesigner();
  }

  subscribeDesigner() {
    // HACK fix
    this.components = new Map(this.designerService.getComponents());
    this.refreshSearchList();
  }

  refreshSearchList() {
    this.search_data = new Map();

    // Sort our data alphabetically
    this.components = new Map(
      [...Array.from(this.components.entries())].sort(function(a, b) {
        return a[1].name.localeCompare(b[1].name);
      })
    );

    for (const entry of Array.from(this.components.entries())) {
      this.search_data.set(entry[0], entry[1].name);
    }
  }

  getSelected() {
    return this.components.get(this.selected_index);
  }

  selectComponent(event: number) {
    this.selected_index = event;
  }

  newComponent() {
    this.designerService.registerNewComponent(new DesignerComponent('New Component', []));
    this.refreshSearchList();
    this.subscribeDesigner();
  }

  changeName(name: string) {
    this.getSelected().setName(name);
    this.refreshSearchList();
    this.subscribeDesigner();
  }

  destroySelected() {
    this.designerService.destroyComponent(this.getSelected().id);
    this.refreshSearchList();
    this.subscribeDesigner();
  }

  addAttributeToSelected() {
    this.getSelected().addAttribute(new DesignerAttribute('New', 'Description'));
    this.refreshSearchList();
    this.subscribeDesigner();
  }

  destroyAttributeFromSelected(index: number) {
    this.getSelected().removeAttribute(index);
    this.refreshSearchList();
    this.subscribeDesigner();
  }

  changeAttributeName(pair: [number, string]) {
    this.getSelected().attributes[pair[0]].name = pair[1];
    this.refreshSearchList();
    this.subscribeDesigner();
  }

  changeAttributeDescription(pair: [number, string]) {
    this.getSelected().attributes[pair[0]].description = pair[1];
    this.refreshSearchList();
    this.subscribeDesigner();
  }
}
