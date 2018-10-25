import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DesignerService } from './../../designer/designer.service';

@Component({
  selector: 'app-trigger-node',
  template: `
    <div [formGroup]="form">
      <span class="node-caption">Trigger</span>
      
      <div class="input-group">
        <input formControlName="name" type="text"/>
      </div>
      
      <div class="input-group">
        <label>Entity</label>
        <select formControlName="entity">
          <option *ngFor="let entity of designerService.getEntities() | keyvalue" value="{{entity.key}}">
            {{entity.value.name}}
          </option>
        </select>
      </div>
      
      <div class="input-group">
        <label>Device</label>
        <select name="action">
          <option value="1">Scanner 1</option>
          <option value="2">Scanner 2</option>
          <option value="3">Scanner 3</option>
          <option value="4">Scanner 4</option>
          <option value="5">Scanner 5</option>
        </select>
      </div>
    </div>
  `,
  styleUrls: ['./flow-node.component.css']
})
export class TriggerNodeComponent {
  form = new FormGroup({
    name: new FormControl('New Trigger'),
    entity: new FormControl(),
    device: new FormControl()
  });

  constructor(private designerService: DesignerService) {}
}
