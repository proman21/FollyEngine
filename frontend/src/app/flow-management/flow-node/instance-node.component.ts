import { Component } from '@angular/core';
import { DesignerService } from './../../designer/designer.service';

@Component({
  selector: 'app-instance-node',
  template: `<div class="input-group">
          <label>Instance</label>
          <input name="name" type="text" value="New Instance"/>
        </div>
        <div class="input-group">
          <label>Entity</label>
          <select name="entity">      
            <option *ngFor="let entity of designerService.getEntities() | keyvalue" value="{{entity.key}}">
              {{entity.value.name}}
            </option>
          </select>
        </div>`,
  styleUrls: ['./flow-node.component.css']
})
export class InstanceNodeComponent {
  constructor(private designerService: DesignerService) {}
}
