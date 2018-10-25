import { Component } from '@angular/core';

@Component({
  selector: 'app-operation-node',
  template: `
    <span class="node-caption">Operation</span>
    <div class="input-group">
      <input name="name" type="text" value="New Operation"/>
    </div>
    <app-attribute-input suffix="A"></app-attribute-input>
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
    <app-attribute-input suffix="B" allowConstant="true"></app-attribute-input>
  `,
  styleUrls: ['./flow-node.component.css']
})
export class OperationNodeComponent {
  constructor() {}
}
