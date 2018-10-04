import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  DesignerEntity,
  DesignerComponent,
  DesignerAttribute,
  DesignerFlow,
  DesignerAsset
} from '../designer/designer';

@Injectable()
export class DesignerService {
  currentProjectName: string;
  currentProject: Project;
  projects: Map<string, Project> = new Map<string, Project>();

  constructor(private http: HttpClient) {}

  async setupExampleData() {
    // EXAMPLE DATA

    // Make entitites
    const playerId = await this.registerNewEntity(new DesignerEntity('Player'));
    const wandId = await this.registerNewEntity(new DesignerEntity('Wand'));
    const shopId = await this.registerNewEntity(new DesignerEntity('Shop'));

    // Make components
    const mortalId = await this.registerNewComponent(
      new DesignerComponent('MortalComponent', [
        new DesignerAttribute('Health', 'Attribute description'),
        new DesignerAttribute('Status', 'Attribute description')
      ])
    );

    const inventoryId = await this.registerNewComponent(
      new DesignerComponent('InventoryComponent', [
        new DesignerAttribute('Money', 'Attribute description'),
        new DesignerAttribute('Items', 'Attribute description'),
        new DesignerAttribute('Max size', 'Attribute description')
      ])
    );

    const magicId = await this.registerNewComponent(
      new DesignerComponent('MagicComponent', [
        new DesignerAttribute('Mana', 'Attribute description'),
        new DesignerAttribute('Max Mana', 'Attribute description'),
        new DesignerAttribute('Spells', 'Attribute description')
      ])
    );

    const rfidId = await this.registerNewComponent(
      new DesignerComponent('RFID', [new DesignerAttribute('id', 'Attribute description')])
    );

    // Assign components
    this.currentProject.entities.get(playerId).addComponent(mortalId);
    this.currentProject.entities.get(playerId).addComponent(inventoryId);
    this.currentProject.entities.get(playerId).addComponent(magicId);
    this.currentProject.entities.get(playerId).addComponent(rfidId);

    this.currentProject.entities.get(wandId).addComponent(magicId);
    this.currentProject.entities.get(wandId).addComponent(rfidId);

    this.currentProject.entities.get(shopId).addComponent(inventoryId);
    this.currentProject.entities.get(shopId).addComponent(rfidId);

    // Add flow
    this.registerNewFlow(new DesignerFlow('New Flow', {}));
  }

  newProject(name: string) {
    console.log('New project');
    const project = new Project();
    this.projects.set(name, project);
    this.currentProjectName = name;
    this.currentProject = project;

    this.http
      .post(
        'api/projects',
        {
          data: {
            type: 'projects',
            attributes: {
              title: name,
              description: '' // TODO
            }
          }
        },
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/vnd.api+json',
            Accept: 'application/vnd.api+json'
          })
        }
      )
      .subscribe(data => {
        project.id = data['data'].id;
        this.setupExampleData();
        this.saveState();
      });
  }

  saveState() {
    // FIXME Registrations and deletions happen instantly
    //       but everything else is patched by this function
    //       which must be manually initiated by the user

    for (const [id, entity] of Array.from(this.currentProject.entities)) {
      this.http.patch(
        `api/projects/${this.currentProject.id}/entities/${id}`,
        {
          data: {
            type: 'entities',
            id: id,
            attributes: {
              name: entity.name,
              description: entity.description
            },
            relationships: {
              components: {
                data: entity.components.reduce((data, c) => {
                  data.push({ type: 'components', id: c });
                  return data;
                }, [])
              }
            }
          }
        },
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/vnd.api+json',
            Accept: 'application/vnd.api+json'
          })
        }
      ).subscribe();
    }

    for (const [id, comp] of Array.from(this.currentProject.components)) {
      this.http.patch(
        `api/projects/${this.currentProject.id}/components/${id}`,
        {
          data: {
            type: 'components',
            id: id,
            attributes: {
              name: comp.name,
              description: comp.description,
              attributes: comp.attributes
            }
          }
        },
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/vnd.api+json',
            Accept: 'application/vnd.api+json'
          })
        }
      ).subscribe();
    }

    for (const [id, flow] of Array.from(this.currentProject.flows)) {
      this.http.patch(
        `api/projects/${this.currentProject.id}/flows/${id}`,
        {
          data: {
            type: 'flows',
            id: id,
            attributes: {
              name: flow.name,
              data: flow.cells
            }
          }
        },
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/vnd.api+json',
            Accept: 'application/vnd.api+json'
          })
        }
      ).subscribe();
    }

    for (const [id, asset] of Array.from(this.currentProject.assets)) {
      // TODO Endpoint does not yet exist
    }
  }

  loadAllProjects() {
    const self = this;
    console.log('Loading projects');
    this.http
      .get('api/projects', {
        headers: new HttpHeaders({
          Accept: 'application/vnd.api+json'
        })
      })
      .subscribe(data => {
        const project = new Project();
        for (const entry of data['data']) {
          const project = new Project();
          project.id = entry.id;
          self.projects.set(entry.attributes.title, project);
        }
      });
  }

  loadProject(name: string) {
    console.log('Loading project: ' + name);
    this.currentProjectName = name;
    this.currentProject = this.projects.get(this.currentProjectName);
    this.loadState();
  }

  loadState() {
    console.log('Loading state');
    this.http.get(`api/projects/${this.currentProject.id}`, {
      headers: new HttpHeaders({
        Accept: 'application/vnd.api+json'
      })
    });
    this.loadFlows();
    this.loadComponents();
    this.loadEntities();

    /*
    for (const entry of assets) {
      this.registerNewAsset(new DesignerAsset(entry.name, entry.file));
    }
    */
  }

  loadEntities() {
    console.log('Loading entities...');
    this.http
      .get(`api/projects/${this.currentProject.id}/entities`, {
        headers: new HttpHeaders({
          Accept: 'application/vnd.api+json'
        })
      })
      .subscribe(data => {
        for (const entry of data['data']) {
          const entity = new DesignerEntity(entry.attributes.name);
          entity.id = entry.id;
          entity.description = entry.attributes.description;
          for (const c in entry.relationships.components.data) {
            entity.addComponent(c['id']);
          }
          this.registerNewEntity(entity);
        }
        console.log('...loaded entities');
      });
  }

  loadComponents() {
    console.log('Loading components...');
    this.http
      .get(`api/projects/${this.currentProject.id}/components`, {
        headers: new HttpHeaders({
          Accept: 'application/vnd.api+json'
        })
      })
      .subscribe(data => {
        for (const entry of data['data']) {
          const attrs = [];
          for (const attr of entry.attributes.attributes) {
            const designerAttribute = new DesignerAttribute(attr.name, attr.description);
            designerAttribute.type = attr.type;
            attrs.push(designerAttribute);
          }
          const component = new DesignerComponent(entry.attributes.name, attrs);
          component.id = entry.id;
          component.description = entry.attributes.description;
          this.registerNewComponent(component);
        }
        console.log('...loaded components');
      });
  }

  loadFlows() {
    console.log('Loading flows...');
    this.http
      .get(`api/projects/${this.currentProject.id}/flows`, {
        headers: new HttpHeaders({
          Accept: 'application/vnd.api+json'
        })
      })
      .subscribe(data => {
        for (const entry of data['data']) {
          const flow = new DesignerFlow(entry.attributes.name, entry.attributes.data);
          flow.id = entry.id;
          this.registerNewFlow(flow);
        }
        console.log('...loaded flows');
      });
  }

  // TODO overloads?
  addComponentToEntity(e: number, c: number) {
    // TODO check registered
    this.currentProject.entities.get(e).addComponent(c);
  }

  removeComponentFromEntity(e: number, c: number) {
    this.currentProject.entities.get(e).removeComponent(c);
  }

  async registerNewEntity(entity: DesignerEntity): Promise<number> {
    if (!entity.id) {
      const data = await this.http
        .post(
          `api/projects/${this.currentProject.id}/entities`,
          {
            data: {
              type: 'entities',
              attributes: {
                name: entity.name,
                description: entity.description
              }
            }
          },
          {
            headers: new HttpHeaders({
              'Content-Type': 'application/vnd.api+json',
              Accept: 'application/vnd.api+json'
            })
          }
        )
        .toPromise();
      entity.id = data['data'].id;
    }
    this.currentProject.entities.set(entity.id, entity);

    return entity.id;
  }

  async registerNewComponent(comp: DesignerComponent): Promise<number> {
    if (!comp.id) {
      const data = await this.http
        .post(
          `api/projects/${this.currentProject.id}/components`,
          {
            data: {
              type: 'components',
              attributes: {
                name: comp.name,
                description: comp.description,
                attributes: comp.attributes
              }
            }
          },
          {
            headers: new HttpHeaders({
              'Content-Type': 'application/vnd.api+json',
              Accept: 'application/vnd.api+json'
            })
          }
        )
        .toPromise();
      comp.id = data['data'].id;
    }
    this.currentProject.components.set(comp.id, comp);

    return comp.id;
  }

  async registerNewFlow(flow: DesignerFlow): Promise<number> {
    if (!flow.id) {
      const data = await this.http
        .post(
          `api/projects/${this.currentProject.id}/flows`,
          {
            data: {
              type: 'flows',
              attributes: {
                name: flow.name,
                data: flow.cells
              }
            }
          },
          {
            headers: new HttpHeaders({
              'Content-Type': 'application/vnd.api+json',
              Accept: 'application/vnd.api+json'
            })
          }
        )
        .toPromise();
      flow.id = data['data'].id;
    }
    this.currentProject.flows.set(flow.id, flow);

    return flow.id;
  }

  registerNewAsset(asset: DesignerAsset): number {
    // TODO
    asset.id = -1;
    this.currentProject.assets.set(asset.id, asset);
    return asset.id;
  }

  destroyEntity(id: number) {
    this.currentProject.entities.delete(id);
    this.http.delete(`api/projects/${this.currentProject.id}/entities/${id}`, {
      headers: new HttpHeaders({
        Accept: 'application/vnd.api+json'
      })
    });
  }

  destroyComponent(c: number) {
    for (const e of Array.from(this.currentProject.entities.keys())) {
      // TODO restrict components to sets per entity
      this.removeComponentFromEntity(e, c);
    }
    this.currentProject.components.delete(c);
    this.http.delete(`api/projects/${this.currentProject.id}/components/${c}`, {
      headers: new HttpHeaders({
        Accept: 'application/vnd.api+json'
      })
    });
  }

  destroyFlow(id: number) {
    this.currentProject.flows.delete(id);
    this.http.delete(`api/projects/${this.currentProject.id}/flows/${id}`, {
      headers: new HttpHeaders({
        Accept: 'application/vnd.api+json'
      })
    });
  }

  destroyAsset(id: number) {
    this.currentProject.assets.delete(id);
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
  id: number;
  entities: Map<number, DesignerEntity> = new Map();
  components: Map<number, DesignerComponent> = new Map();
  flows: Map<number, DesignerFlow> = new Map();
  assets: Map<number, DesignerAsset> = new Map();
}
