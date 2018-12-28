import { Injectable } from "@angular/core";
import { createFlow, Flow } from "./flow.model";
import { FlowStore } from "./flow.store";
import { FlowQuery } from "./flow.query";
import { ProjectsQuery } from "../project/project.query";
import { applyTransaction, filterNil, ID } from "@datorama/akita";
import { emptyIGraph, IFlowGraph } from "./editor/serialisation";
import { FlowDataService } from "../../api/flow-data.service";
import { switchMap } from "rxjs/operators";
import { StateModule } from "../state.module";

@Injectable({
  providedIn: StateModule
})
export class FlowService {
  constructor(
    private flowDataService: FlowDataService,
    private flowStore: FlowStore,
    private flowQuery: FlowQuery,
    private projectsQuery: ProjectsQuery,
  ) {
    this.projectsQuery.selectActive().pipe(
      filterNil
    ).subscribe(() => this.loadFlows());
  }
  loadFlows() {
    this.flowDataService.all({
      beforepath: this.projectsQuery.projectPath
    }).subscribe(flows => {
        this.flowStore.set(flows.data.map(flow => {
          return createFlow({
            id: flow.id,
            name: flow.attributes.name,
            description: flow.attributes.description,
            graph: flow.attributes.graph
          });
        }));
      }, err => {
        this.flowStore.setError(err);
      });
  }

  newFlow() {
    const flow = this.flowDataService.new();
    flow.attributes.name = this.findNewName();
    flow.attributes.graph = emptyIGraph;
    console.log(flow);
    flow.save({
      beforepath: this.projectsQuery.projectPath
    }).subscribe(res => {
      applyTransaction(() => {
        this.flowStore.add(createFlow({
          id: flow.id,
          name: flow.attributes.name,
          description: flow.attributes.description,
          graph: emptyIGraph
        }));
        this.flowStore.setActive(flow.id);
      })
    }, err => {
      this.flowStore.setError(err);
    });
  }

  openFlow(id: ID) {
    this.flowStore.setActive(id);
  }

  private findNewName(): string {
    const base = 'New Flow';
    let number = 0;
    let name = base;

    while(this.flowQuery.getCount(e => e.name === name) > 0) {
      number++;
      name = `${base} (${number})`;
    }

    return name;
  }

  saveFlowGraph(graph: IFlowGraph) {
    this.flowDataService.get(<string>this.flowQuery.getActiveId(), {
      beforepath: this.projectsQuery.projectPath
    }).pipe(
      switchMap(flow => {
        flow.attributes.graph = graph;
        return flow.save({ beforepath: this.projectsQuery.projectPath });
      })
    ).subscribe(res => {
      this.flowStore.updateActive(flow => {
        return {
          ...flow,
          graph
        }
      })
    });
  }
}
