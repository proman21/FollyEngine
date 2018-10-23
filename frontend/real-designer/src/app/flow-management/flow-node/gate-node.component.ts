import { Component } from '@angular/core';

@Component({
  selector: 'app-gate-node',
  template: `<div class="input-group">
          <label>Gate</label>
          <select name="flow">
            <option value="&&">And</option>
            <option value="||">Or</option>
          </select>
        </div>`,
  styleUrls: ['./flow-node.component.css']
})
export class GateNodeComponent {
  constructor() {}
}
