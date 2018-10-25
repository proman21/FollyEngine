import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DesignerService } from './../../designer/designer.service';

@Component({
  selector: 'app-operation-node',
  template: `
    <div [formGroup]="form">
      <span class="node-caption">Operation</span>
      
      <div class="input-group">
        <input formControlName="name" type="text"/>
      </div>
      
      <div class="input-group">
        <label>Entity</label>
        <select formControlName="entityA">
          <option *ngFor="let entity of designerService.getEntities() | keyvalue" value="{{entity.key}}">
            {{entity.value.name}}
          </option>
        </select>
        
        <label>Attribute</label>
        <select formControlName="valueA">
          <option *ngFor="let option of attributeOptions[form.value.entityA]">
            {{option}}
          </option>
        </select>
      </div>
      
      <div class="input-group">
        <label>Action</label>
        <select name="action">
          <option value="+">Add</option>
          <option value="-">Subtract</option>
          <option value="*">Multiply</option>
          <option value="/">Divide</option>
          <option value="=">Set</option>
        </select>
      </div>
      
      <div class="input-group">
        <label>Entity</label>
        <select formControlName="entityB">
          <option value="0" selected="selected">
            Constant
          </option>
          <option *ngFor="let entity of designerService.getEntities() | keyvalue" value="{{entity.key}}">
            {{entity.value.name}}
          </option>
        </select>
        
        <label *ngIf="form.value.entityB == 0">Value</label>
        <input *ngIf="form.value.entityB == 0" formControlName="valueB" type="text"/>
        
        <label *ngIf="form.value.entityB != 0">Attribute</label>
        <select *ngIf="form.value.entityB != 0" formControlName="valueB">
          <option *ngFor="let option of attributeOptions[form.value.entityB]">
            {{option}}
          </option>
        </select>
      </div>
    </div>
  `,
  styleUrls: ['./flow-node.component.css']
})
export class OperationNodeComponent {
  form = new FormGroup({
    name: new FormControl('New Operation'),
    entityA: new FormControl(),
    valueA: new FormControl(),
    action: new FormControl(),
    entityB: new FormControl(0),
    valueB: new FormControl()
  });

  attributeOptions: any[];

  constructor(private designerService: DesignerService) {
    const attributeOptions = [];
    this.designerService.getEntities().forEach(e => {
      attributeOptions[e.id] = [];
      e.components.forEach(c => {
        this.designerService
          .getComponents()
          .get(c)
          .attributes.forEach(function(attr) {
            attributeOptions[e.id].push(attr.name);
          });
      });
    });
    this.attributeOptions = attributeOptions;
  }
}
