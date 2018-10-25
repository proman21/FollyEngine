import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-trigger-node',
  template: `
      <span class="node-caption">Trigger</span>
      <div class="input-group">
        <input name="name" type="text" value="New Trigger"/>
      </div>
      <div class="input-group">
        <label>Type</label>
        <select name="trigger">${'<option>test</option>'}</select>
      </div>
      <div class="input-group">
        <label>Entity</label>
        <select name="entity">${'<option>test</option>'}</select>
      </div>
  `,
  styleUrls: ['./flow-node.component.css']
})
export class TriggerNodeComponent implements OnInit {
  private triggerOptions = ['RFID'].reduce<string>((s, value) => {
    s += `<option>${value}</option>`;
    return s;
  }, '');

  constructor() {}

  ngOnInit() {}
}
