import { Component, ViewEncapsulation } from '@angular/core';
import { FlowNodeService } from './flow-node.service';

@Component({
  selector: 'app-asset-input',
  template: `
    <div class="input-group">
      <label>Asset</label>
      <select name="asset">
        <option *ngFor="let asset of flowNodeService.options.assets" value="{{asset.id}}">
          {{asset.name}}
        </option>
      </select>
    </div>
  `,
  styles: [],
  encapsulation: ViewEncapsulation.None
})
export class AssetInputComponent {
  constructor(private flowNodeService: FlowNodeService) {}
}
