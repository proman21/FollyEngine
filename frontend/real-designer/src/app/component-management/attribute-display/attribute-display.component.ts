import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DesignerEntity, DesignerComponent, DesignerAttribute } from '../../designer/designer';

@Component({
  selector: 'attribute-display',
  templateUrl: './attribute-display.component.html',
  styleUrls: ['./attribute-display.component.css']
})
export class AttributeDisplayComponent implements OnInit {
	@Input() attributes: DesignerAttribute[];

	@Output() onDestroyAttribute = new EventEmitter<number>();
	@Output() onNameChangeAttribute = new EventEmitter<[number, string]>();
	@Output() onDescriptionChangeAttribute = new EventEmitter<[number, string]>();

	constructor() { }

	ngOnInit() {
	}
}
