import { DesignerEntityStore } from "./entity.store";
import { DesignerEntityQuery } from "./entity.query";
import { Injectable } from "@angular/core";
import { ProjectsQuery } from "../project/project.query";
import { createEntity, DesignerEntity } from "./entity.model";
import { applyTransaction, filterNil, ID, push, remove } from "@datorama/akita";
import { EntityDataService } from "../../api/entity-data.service";
import { switchMap } from "rxjs/operators";
import { ComponentDataService } from "../../api/component-data.service";
import { combineLatest } from "rxjs";
import { StateModule } from "../state.module";

@Injectable({
  providedIn: StateModule
})
export class EntityService {
  constructor(
    private entityDataService: EntityDataService,
    private projectsQuery: ProjectsQuery,
    private entityStore: DesignerEntityStore,
    private entityQuery: DesignerEntityQuery,
    private componentDataService: ComponentDataService
  ) {
    this.projectsQuery.selectActive().pipe(
      filterNil
    ).subscribe(() => this.loadEntities());
  }

  loadEntities() {
    this.entityDataService.all({
      beforepath: this.projectsQuery.projectPath
    }).subscribe(entities => {
        this.entityStore.set(entities.data.map(entity => createEntity({
          id: entity.id,
          ...entity.attributes
        })));
    }, err => {
      this.entityStore.setError(err);
    });
  }

  newEntity() {
    const entity = this.entityDataService.new();
    entity.attributes.name = this.findNewName();
    entity.save({ beforepath: this.projectsQuery.projectPath}).subscribe(res => {
      applyTransaction(() => {
        this.entityStore.add(createEntity({
          id: entity.id,
          ...entity.attributes
        }));
        this.entityStore.setActive(entity.id);
      });
    }, err => {
      this.entityStore.setError(err);
    });
  }

  openEntity(id: ID) {
    this.entityStore.setActive(id);
  }

  addComponentToEntity(compId: ID) {
    combineLatest(
      this.entityDataService.get(<string>this.entityQuery.getActiveId(), {
      beforepath: this.projectsQuery.projectPath
      }),
      this.componentDataService.get(<string>compId, {
        beforepath: this.projectsQuery.projectPath
      })
    ).pipe(
      switchMap(([entity, component]) => {
        entity.addRelationship(component);
        return entity.save({ beforepath: this.projectsQuery.projectPath });
      })
    ).subscribe(res => {
      this.entityStore.updateActive(entity => {
        return {
          ...entity,
          components: push(entity.components, compId)
        }
      })
    });
  }

  removeComponentFromEntity(index: number, compId: ID) {
    this.entityDataService.get(<string>this.entityQuery.getActiveId(), {
      beforepath: this.projectsQuery.projectPath
    }).pipe(
      switchMap(entity => {
        entity.removeRelationship('components', <string>compId);
        return entity.save({ beforepath: this.projectsQuery.projectPath });
      })
    ).subscribe(res => {
      this.entityStore.updateActive(entity => {
        return {
          ...entity,
          components: remove(entity.components, index)
        }
      })
    });

  }

  updateEntity(input: {name: string, description: string}) {
    this.entityDataService.get(<string>this.entityQuery.getActiveId(), {
      beforepath: this.projectsQuery.projectPath
    }).pipe(
      switchMap(entity => {
        entity.attributes = {
          ...entity.attributes,
          ...input
        };
        return entity.save({ beforepath: this.projectsQuery.projectPath });
      })
    ).subscribe(res => {
      this.entityStore.updateActive(entity => {
        return {
          ...entity,
          ...input
        }
      })
    })
  }

  private findNewName(): string {
    const base = 'New Entity';
    let number = 0;
    let name = base;

    while(this.entityQuery.getCount(e => e.name === name) > 0) {
      number++;
      name = `${base} (${number})`;
    }

    return name;
  }
}
