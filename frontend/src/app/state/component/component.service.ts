import { ComponentStore } from "./component.store";
import { ComponentQuery } from "./component.query";
import { Attribute, createComponent} from "./component.model";
import { applyTransaction, filterNil, ID, push, remove, update } from "@datorama/akita";
import { ProjectsQuery } from "../project/project.query";
import { Injectable } from "@angular/core";
import { ComponentDataService } from "../../api/component-data.service";
import { filter, switchMap } from "rxjs/operators";
import { StateModule } from "../state.module";

@Injectable({
  providedIn: StateModule
})
export class ComponentService {
  constructor(
    private componentDataService: ComponentDataService,
    private componentStore: ComponentStore,
    private componentQuery: ComponentQuery,
    private projectsQuery: ProjectsQuery
  ) {
    this.projectsQuery.selectActive().pipe(
      filterNil
    ).subscribe(() => this.loadComponents());
  }

  loadComponents() {
    this.componentDataService.all({
      beforepath: this.projectsQuery.projectPath
    }).subscribe(comps => {
      this.componentStore.set(comps.data.map(comp => {
        return createComponent({id: comp.id, ...comp.attributes});
      }));
    }, err => {
      this.componentStore.setError(err);
    })
  }

  openComponent(id: ID) {
    this.componentStore.setActive(id);
  }

  newComponent() {
    const comp = this.componentDataService.new();
    comp.attributes.name = this.findNewName();
    comp.attributes.attributes = [];
    comp.save({
      beforepath: this.projectsQuery.projectPath
    }).subscribe(res => {
      applyTransaction(() => {
        this.componentStore.add(createComponent({
          id: comp.id,
          ...comp.attributes
        }));
        this.componentStore.setActive(comp.id);
      });
    }, err => {
      this.componentStore.setError(err);
    });
  }

  addAttribute(attribute: Attribute) {
    this.componentDataService.get(<string>this.componentQuery.getActiveId(), {
      beforepath: this.projectsQuery.projectPath
    }).pipe(
      switchMap(comp => {
        comp.attributes.attributes = push(comp.attributes.attributes, attribute);
        return comp.save({ beforepath: this.projectsQuery.projectPath });
      })
    ).pipe(filter(res => res['data'])).subscribe(res => {
      this.componentStore.updateActive(component => {
        return {
          ...component,
          attributes: push(component.attributes, attribute)
        }
      });
    });
  }

  removeAttribute(index: number) {
    this.componentDataService.get(<string>this.componentQuery.getActiveId(), {
      beforepath: this.projectsQuery.projectPath
    }).pipe(
      switchMap(comp => {
        comp.attributes.attributes = remove(comp.attributes.attributes, index);
        return comp.save({ beforepath: this.projectsQuery.projectPath });
      })
    ).subscribe(res => {
      this.componentStore.updateActive(component => {
        return {
          ...component,
          attributes: remove(component.attributes, index)
        }
      });
    });

  }

  updateAttribute(index: number, newAttr: Attribute) {
    this.componentDataService.get(<string>this.componentQuery.getActiveId(), {
      beforepath: this.projectsQuery.projectPath
    }).pipe(
      switchMap(comp => {
        comp.attributes.attributes = update(comp.attributes.attributes, index, newAttr);
        return comp.save({ beforepath: this.projectsQuery.projectPath });
      })
    ).subscribe(res => {
      this.componentStore.updateActive(component => {
        return {
          ...component,
          attributes: update(component.attributes, index, newAttr)
        }
      })
    })
  }

  updateComponent(input: {name: string, description: string}) {
    this.componentDataService.get(<string>this.componentQuery.getActiveId(), {
      beforepath: this.projectsQuery.projectPath
    }).pipe(
      switchMap(component => {
        component.attributes = {
          ...component.attributes,
          ...input
        };
        return component.save({ beforepath: this.projectsQuery.projectPath });
      })
    ).subscribe(res => {
      this.componentStore.updateActive(component => {
        return {
          ...component,
          ...input
        }
      })
    })
  }

  private findNewName(): string {
    const base = 'New Component';
    let number = 0;
    let name = base;

    while(this.componentQuery.getCount(e => e.name === name) > 0) {
      number++;
      name = `${base} (${number})`;
    }

    return name;
  }
}
