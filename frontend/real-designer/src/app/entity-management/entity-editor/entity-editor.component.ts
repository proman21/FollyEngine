import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DesignerEntity, DesignerComponent } from '../../designer/designer';
import { MatIconRegistry } from "@angular/material";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
	selector: 'entity-editor',
	templateUrl: './entity-editor.component.html',
	styleUrls: ['./entity-editor.component.css']
})
export class EntityEditorComponent implements OnInit {
	@Input() entity: DesignerEntity;
	@Input() components: Map<number, DesignerComponent>;
	component_list: DesignerComponent[];
	@Output() onDestroyEntity = new EventEmitter<any>();
	@Output() onNameChange = new EventEmitter<string>();
	@Output() onDestroyComponent = new EventEmitter<number>();
	@Output() onNewComponent = new EventEmitter<any>();

	constructor(private domSanitizer: DomSanitizer,
    public matIconRegistry: MatIconRegistry) {
    // Add custom material icons
	}

	ngOnInit() {
		this.buildComponentList();
	}

	ngOnChanges(changes) {
		this.buildComponentList();
	}

	buildComponentList() {
		if (this.entity) {
			this.component_list = [];
			for (var c_id of this.entity.components) {
				this.component_list.push(this.components.get(c_id));
			}
		}
	}

	nameChange(event: any) {
		this.onNameChange.emit(event.target.value);
	}

	addComponent(event: any) {
		this.onNewComponent.emit();
	}

}
