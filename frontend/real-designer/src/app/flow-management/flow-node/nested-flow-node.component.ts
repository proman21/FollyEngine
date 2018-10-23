import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nested-flow-node',
  template: `<div class="input-group">
          <label>Flow</label>
          <select name="flow">${'options.flows'}</select>
        </div>`,
  styleUrls: ['./flow-node.component.css']
})
export class NestedFlowNodeComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
