import { Component } from '@angular/core';

@Component({
  selector: 'app-condition-node',
  template: `
    <span class="node-caption">Condition</span>
    <div class="input-group">
      <input name="name" type="text" value="New Condition"/>
    </div>
    <app-attribute-input suffix="A"></app-attribute-input>
    <div class="input-group">
      <label>is</label>
      <select name="action">
        <option value="==">Equal to</option>
        <option value=">">Greater than</option>
        <option value="<">Less than</option>
        <option value=">=">Greater than or equal to</option>
        <option value="<=">Less than or equal to</option>
      </select>
    </div>
    <app-attribute-input suffix="B" allowConstant="true"></app-attribute-input>
  `,
  styleUrls: ['./flow-node.component.css']
})
export class ConditionNodeComponent {
  constructor() {}
}
