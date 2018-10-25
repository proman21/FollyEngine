import { Component } from '@angular/core';

@Component({
  selector: 'app-action-node',
  template: `
    <span class="node-caption">Action</span>
    <div class="input-group">
      <input name="name" type="text" value="New Action"/>
    </div>
    <app-attribute-input></app-attribute-input>
    <app-asset-input></app-asset-input>
  `,
  styleUrls: ['./flow-node.component.css']
})
export class ActionNodeComponent {
  constructor() {}
}
