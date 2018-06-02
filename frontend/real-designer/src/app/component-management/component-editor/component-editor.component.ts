import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DesignerEntity, DesignerComponent } from '../../designer/designer';

@Component({
  selector: 'component-editor',
  templateUrl: './component-editor.component.html',
  styleUrls: ['./component-editor.component.css']
})
export class ComponentEditorComponent implements OnInit {
	@Input() component: DesignerComponent;

	@Output() onNameChange = new EventEmitter<string>();
	@Output() onDestroyComponent = new EventEmitter<number>();

	@Output() onNewAttribute = new EventEmitter<any>();
	@Output() onDestroyAttribute = new EventEmitter<number>();
	@Output() onNameChangeAttribute = new EventEmitter<[number, string]>();
	@Output() onDescriptionChangeAttribute = new EventEmitter<[number, string]>();

	constructor() { }

	ngOnInit() {
	}

	ngOnChanges(changes) {
    }
}
