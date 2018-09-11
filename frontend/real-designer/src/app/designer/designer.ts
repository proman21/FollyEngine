export class DesignerEntity {
	id: number; // unique ID
	name: string;
	components: number[]; // Array of ids associated with components

	constructor(name: string) {
		this.name = name;
		this.components = [];
	}

	getName() {
		return this.name;
	}

	setName(name: string) {
		this.name = name;
	}

	addComponent(id: number) {
		this.components.push(id);
	}

	removeComponent(id: number) {
		for (var i = this.components.length - 1; i >= 0; i--) {
			if (this.components[i] == id) {
				this.components.splice(i, 1);
				break;
			}
		}
	}
}

export class DesignerComponent {
	id: number; // unique ID
	name: string;
	description: string;
	attributes: DesignerAttribute[];

	constructor(name: string, attributes: DesignerAttribute[]) {
		this.name = name;
		this.attributes = attributes;
	}

	addAttribute(attr: DesignerAttribute) {
		this.attributes.push(attr);
	}

	removeAttribute(id: number) {
		this.attributes.splice(id, 1);
	}

	setName(name: string) {
		this.name = name;
	}

	getName() {
		return this.name;
	}

	getDescription() {
		return this.description;
	}
}

export class DesignerAttribute {
	name: string;
	description: string;
	type: string;

	constructor(name: string, description: string) {
		this.name = name;
		this.description = description;
		this.type = "This is the type"
	}

	getName() {
		return this.name;
	}

	getDescription() {
		return this.description;
	}

	getType() {
		return this.type;
	}

}

export class DesignerFlow {
	id: number; // unique ID
	name: string;
	cells: {}

	constructor(name: string, cells: {}) {
		this.name = name;
		this.cells = cells;
	}
}

export class DesignerAsset {
	id: number;
	name: string;
	file: string;

	constructor(name: string, file: string) {
		this.name = name;
		this.file = file;
	}

	setName(name: string) {
		this.name = name;
	}

	setFile(file: string) {
		this.file = file;
	}

	getName() {
		return this.file;
	}

	getFile() {
		return this.file;
	}
}
