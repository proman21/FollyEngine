import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DesignerComponent } from "../../../../state/component/component.model";

@Component({
  selector: 'component-display',
  templateUrl: './component-display.component.html',
  styleUrls: ['./component-display.component.css']
})
export class ComponentDisplayComponent implements OnInit {
  @Input()
  component: DesignerComponent;

  @Output()
  destroyComponent = new EventEmitter<[number, string]>();

  constructor() {}

  ngOnInit() {}
}
