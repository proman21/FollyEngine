import { Component, Input } from '@angular/core';
import { DesignerService } from './../../designer/designer.service';

@Component({
  selector: 'app-attribute-input',
  template: `
    <div class="input-group">
      <label>Entity</label>
      <select [(ngModel)]="selectedEntity" [attr.name]="'entity' + suffix">
        <option *ngIf="allowConstant" value="0" selected="selected">
          Constant
        </option>
        <option *ngFor="let entity of designerService.getEntities() | keyvalue" value="{{entity.key}}">
          {{entity.value.name}}
        </option>
      </select>
      
      <label *ngIf="allowConstant && selectedEntity == 0">Value</label>
      <input *ngIf="allowConstant && selectedEntity == 0" [attr.name]="'value' + suffix" type="text" value=""/>
      
      <label *ngIf="!allowConstant || selectedEntity != 0">Attribute</label>
      <select *ngIf="!allowConstant || selectedEntity != 0" [attr.name]="'value' + suffix">
        <option *ngFor="let option of attributeOptions[selectedEntity]">
          {{option}}
        </option>
      </select>
    </div>
  `,
  styles: []
})
export class AttributeInputComponent {
  @Input()
  suffix = '';
  @Input()
  allowConstant = false;

  selectedEntity = 0;
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
