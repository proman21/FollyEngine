import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { HttpClient } from "@angular/common/http";
import { DesignerEntity, DesignerComponent, DesignerAttribute, DesignerFlow, DesignerAsset } from '../designer/designer';

@Injectable()
export class DesignerService {
	currentProjectName: string;
	currentProject: Project;
	projects: Map<string, Project> = new Map<string, Project>();

	constructor() {
	}

	setupExampleData() {
		// EXAMPLE DATA

		// Make entitites
		this.registerNewEntity(new DesignerEntity("Player"));
		this.registerNewEntity(new DesignerEntity("Wand"));
		this.registerNewEntity(new DesignerEntity("Shop"));

		// Make components
		this.registerNewComponent(new DesignerComponent("MortalComponent", [
			new DesignerAttribute("Health", "Attribute description"),
			new DesignerAttribute("Status", "Attribute description"),
			]));

		this.registerNewComponent(new DesignerComponent("InventoryComponent", [
			new DesignerAttribute("Money", "Attribute description"),
			new DesignerAttribute("Items", "Attribute description"),
			new DesignerAttribute("Max size", "Attribute description"),
			]));

		this.registerNewComponent(new DesignerComponent("MagicComponent", [
			new DesignerAttribute("Mana", "Attribute description"),
			new DesignerAttribute("Max Mana", "Attribute description"),
			new DesignerAttribute("Spells", "Attribute description"),
			]));

		this.registerNewComponent(new DesignerComponent("RFID", [
			new DesignerAttribute("id", "Attribute description"),
			]));

		// Assign components
		this.currentProject.entities.get(0).addComponent(0);
		this.currentProject.entities.get(0).addComponent(1);
		this.currentProject.entities.get(0).addComponent(2);
		this.currentProject.entities.get(0).addComponent(3);

		this.currentProject.entities.get(1).addComponent(2);
		this.currentProject.entities.get(1).addComponent(3);

		this.currentProject.entities.get(2).addComponent(1);
		this.currentProject.entities.get(2).addComponent(3);

		// Add flow
		this.registerNewFlow(new DesignerFlow("New Flow", null));
	}

	newProject(name: string) {
		console.log("new project");
		this.currentProjectName = name;
		let email = sessionStorage.getItem('email');
		let project = name;

		// TODO
		/*
		$.ajax({
			url: 'new-project.php',
			type: "POST",
			data: {email: email, project: project}
		});
		*/

		let p = new Project();
		this.projects.set(name, p);
		this.currentProject = p;

		this.setupExampleData();
		this.saveState();
	}

	saveState() {
		let email = sessionStorage.getItem('email');
		let project = this.currentProjectName;

		// convert maps to plain JS arrays
		let entities = Array.from(this.currentProject.entities)
			.reduce((o, [key, value]) => {
				o[key] = value;
				return o;
			}, []);
		let components = Array.from(this.currentProject.components)
			.reduce((o, [key, value]) => {
				o[key] = value;
				return o;
			}, []);
		let flows = Array.from(this.currentProject.flows)
			.reduce((o, [key, value]) => {
				o[key] = value;
				return o;
			}, []);
		let assets = Array.from(this.currentProject.assets)
			.reduce((o, [key, value]) => {
				o[key] = value;
				return o;
			}, []);

		// TODO
		/*
		$.ajax({
			url: 'save-state.php',
			type: "POST",
			data: {email: email, project: project, entities: entities, components: components}
		});
		*/
		let state = JSON.stringify({
			email: email,
			project: project,
			entities: entities,
			components: components,
			flows: flows,
			assets: assets
		});
		console.log(JSON.parse(state));
		localStorage.setItem("localState", state);
	}

	loadAllProjects() {
		console.log("loading projects");

		let self = this;
		let email = sessionStorage.getItem('email');

		// TODO
		/*
		$.ajax({
			url: 'get-projects.php',
			type: "GET",
			data: {email: email},
			success: function(data) {
				let projs = data.split("\n");
				for (let p in projs) {
					if (projs[p] != "") {
						let project = new Project();
						self.projects.set(projs[p], project);
					}
				}
			}
		});
		*/
		let stateString = localStorage.getItem("localState");
		if (stateString != null) {
			let state = JSON.parse(stateString);
			self.projects.set(state.project, new Project());
		}
	}

	loadProject(name: string) {
		console.log("loading project: " + name);
		this.currentProjectName = name;
		this.loadState();
	}

	loadState() {
		console.log("Loading state");
		let self = this;
		let email = sessionStorage.getItem('email');

		let project = this.currentProjectName;
		this.currentProject = this.projects.get(this.currentProjectName);

		// TODO
		/*
		$.ajax({
			url: 'load-state.php',
			type: "GET",
			data: {email: email, project: project},
			success: function(data) {
				let state = JSON.parse(data);
				let components = state["components"];
				let entities = state["entities"];

				for (var comp in components) {
					let c = components[comp];
					let attrs = [];

					for (var a in c["attributes"]) {
						let atr = c["attributes"][a];
						attrs.push(new DesignerAttribute(atr.name, atr.description));
					}
					self.registerNewComponent(new DesignerComponent(c.name, attrs));
				}
				for (var ent in entities) {
					let e = entities[ent];
					let de = new DesignerEntity(e.name);

					for (var c in e["components"]) {
						de.addComponent(e["components"][c]);
					}

					self.registerNewEntity(de);
				}

			}
		});
		*/
		let state = JSON.parse(localStorage.getItem("localState"));
		let components = state.components;
		let entities = state.entities;
		let flows = state.flows;
		let assets = state.assets;

		for (let entry of components) {
			let attrs = [];
			for (let attr of entry.attributes) {
				attrs.push(new DesignerAttribute(attr.name, attr.description));
			}
			this.registerNewComponent(new DesignerComponent(entry.name, attrs));
		}

		for (let entry of entities) {
			let entity = new DesignerEntity(entry.name);
			for (var c in entry.components) {
				entity.addComponent(entry.components[c]);
			}
			this.registerNewEntity(entity);
		}

		for (let entry of flows) {
			let flow = new DesignerFlow(entry.name, entry.cells);
			this.registerNewFlow(flow)
		}

		for (let entry of assets) {
			this.registerNewAsset(new DesignerAsset(entry.name, entry.file));
		}
	}

	// TODO overloads?
	addComponentToEntity(e_id: number, c_id: number) {
		// TODO check registered
		this.currentProject.entities.get(e_id).addComponent(c_id);
	}

	removeComponentFromEntity(e_id: number, c_id: number) {
		this.currentProject.entities.get(e_id).removeComponent(c_id);
	}

	registerNewEntity(entity: DesignerEntity): number {
		let id = this.currentProject.ent_gen.gen();
		entity.id = id;
		this.currentProject.entities.set(id, entity);

		return id;
	}

	registerNewComponent(comp: DesignerComponent): number {
		let id = this.currentProject.comp_gen.gen();
		comp.id = id;
		this.currentProject.components.set(id, comp);

		return id;
	}

	registerNewFlow(flow: DesignerFlow): number {
		let id = this.currentProject.flow_gen.gen();
		flow.id = id;
		this.currentProject.flows.set(id, flow);

		return id;
	}

	registerNewAsset(asset: DesignerAsset): number {
		let id = this.currentProject.asset_gen.gen();
		asset.id = id;
		this.currentProject.assets.set(id, asset);

		return id;
	}

	destroyEntity(e_id: number) {
		this.currentProject.entities.delete(e_id);
	}

	destroyFlow(id: number) {
		this.currentProject.flows.delete(id);
	}

	destroyComponent(c_id: number) {
		for (let e_id of Array.from(this.currentProject.entities.keys())) {
			// TODO restrict components to sets per entity
			this.removeComponentFromEntity(e_id, c_id);
		}
		this.currentProject.components.delete(c_id);
	}

	getEntities() {
		return this.currentProject.entities;
	}

	getComponents() {
		return this.currentProject.components;
	}

	getFlows() {
		return this.currentProject.flows;
	}

	getAssets() {
		return this.currentProject.assets;
	}

	getAllProjects() {
		return this.projects;
	}
}

export class Project {
	ent_gen: NumGen = new NumGen();
	comp_gen: NumGen = new NumGen();
	flow_gen: NumGen = new NumGen();
	asset_gen: NumGen = new NumGen();
	entities: Map<number, DesignerEntity> = new Map();
	components: Map<number, DesignerComponent> = new Map();
	flows: Map<number, DesignerFlow> = new Map();
	assets: Map<number, DesignerAsset> = new Map();
}

class NumGen {
	num: number = 0;
	gen() {
		return this.num++;
	}
}
