import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DesignerService } from './../../designer/designer.service';

@Component({
  selector: 'app-flow-node',
  template: `
    <div [formGroup]="form">
      <div class="input-group">
        <label>Flow</label>
        <select formControlName="flow">
          <option *ngFor="let flow of designerService.getFlows() | keyvalue" value="{{flow.key}}">
            {{flow.value.name}}
          </option>
        </select>
      </div>
    </div>
  `,
  styleUrls: ['./flow-node.component.css']
})
export class NestedFlowNodeComponent {
  form = new FormGroup({
    flow: new FormControl()
  });

  constructor(private designerService: DesignerService) {}
}
