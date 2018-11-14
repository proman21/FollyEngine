import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-action-node',
  template: `
    <div [formGroup]="form">
      <span class="node-caption">Action</span>
      
      <div class="input-group">
        <input formControlName="name" type="text"/>
      </div>

      <div class="input-group">
        <label>Asset</label>
        <input formControlName="asset" type="text"/>
      </div>
        
      <div class="input-group">
        <label>Target</label>
        <input formControlName="target" type="text"/>
      </div>
    </div>
  `,
  styleUrls: ['./flow-node.component.css']
})
export class ActionNodeComponent {
  form = new FormGroup({
    name: new FormControl('New Action'),
    asset: new FormControl(),
    target: new FormControl()
  });
}
