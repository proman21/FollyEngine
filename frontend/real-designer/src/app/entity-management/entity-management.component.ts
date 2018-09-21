import { Component, OnInit, Inject } from '@angular/core';
import { DesignerEntity, DesignerComponent, DesignerAttribute } from '../designer/designer';
import { DesignerService } from '../designer/designer.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { GenericSelectDialog } from '../dialogs/dialogs.component';

@Component({
  selector: 'entity-management',
  templateUrl: './entity-management.component.html',
  styleUrls: ['./entity-management.component.css']
})
export class EntityManagementComponent implements OnInit {
  title = 'Real Designer';
  entities: Map<number, DesignerEntity> = new Map();
  components: Map<number, DesignerComponent> = new Map();
  search_data: Map<number, string> = new Map();
  selected_index = 0;

  constructor(private designerService: DesignerService, public dialog: MatDialog) {}

  openDialog() {
    const dialogRef = this.dialog.open(GenericSelectDialog, {
      width: '250px',
      data: {
        title: 'Choose Component',
        description: 'Choose a component:',
        placeholder: 'Component',
        elements: Array.from(this.components.values())
      }
    });

    dialogRef.afterClosed().subscribe(id => {
      if (id !== undefined) {
        this.addComponentToSelected(id);
        this.subscribeDesigner();
      }
    });
  }

  ngOnInit() {
    this.subscribeDesigner();
    // Show first entity by default
    this.selected_index = this.entities.entries().next().value[1].id;
  }

  subscribeDesigner() {
    // HACK fix
    this.entities = new Map(this.designerService.getEntities());
    this.components = new Map(this.designerService.getComponents());
    this.refreshSearchList();
  }

  refreshSearchList() {
    this.search_data = new Map();

    // Sort our data alphabetically
    this.entities = new Map(
      [...Array.from(this.entities.entries())].sort(function(a, b) {
        return a[1].name.localeCompare(b[1].name);
      })
    );

    for (const entry of Array.from(this.entities.entries())) {
      this.search_data.set(entry[0], entry[1].name);
    }
  }

  getSelected() {
    return this.entities.get(this.selected_index);
  }

  newEntity() {
    this.designerService.registerNewEntity(new DesignerEntity('New Entity')).then(() => this.subscribeDesigner());
  }

  destroySelected() {
    this.designerService.destroyEntity(this.getSelected().id);
    this.refreshSearchList();
    this.subscribeDesigner();
  }

  selectEntity(event: number) {
    this.selected_index = event;
  }

  entityNameChange(name: string) {
    this.entities.get(this.selected_index).setName(name);
    this.refreshSearchList();
    this.subscribeDesigner();
  }

  newComponent() {
    this.openDialog();
  }

  addComponentToSelected(id: number) {
    this.designerService.addComponentToEntity(this.getSelected().id, id);
    this.subscribeDesigner();
  }

  destroyComponentFromSelected(id: number) {
    this.designerService.removeComponentFromEntity(this.getSelected().id, id);
    this.subscribeDesigner();
  }
}
