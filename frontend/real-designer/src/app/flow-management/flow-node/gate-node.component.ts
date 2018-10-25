import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-gate-node',
  template: `
    <div [formGroup]="form">
      <div class="input-group">
      <label>Gate</label>
      <select formControlName="gate">
        <option value="&&">And</option>
        <option value="||">Or</option>
      </select>
      </div>
    </div>
  `,
  styleUrls: ['./flow-node.component.css']
})
export class GateNodeComponent {
  form = new FormGroup({
    gate: new FormControl()
  });
}
