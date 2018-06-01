import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DesignerEntity, DesignerComponent } from '../../designer/designer';

@Component({
  selector: 'component-display',
  templateUrl: './component-display.component.html',
  styleUrls: ['./component-display.component.css']
})
export class ComponentDisplayComponent implements OnInit {

	@Input() components: DesignerComponent[];

	@Output() onDestroyComponent = new EventEmitter<number>();

	constructor() { }

	ngOnInit() {
	}


}