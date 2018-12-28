import { QueryEntity } from "@datorama/akita";
import { FlowState, FlowStore } from "./flow.store";
import { Flow } from "./flow.model";
import { Injectable } from "@angular/core";
import { StateModule } from "../state.module";

@Injectable({
  providedIn: StateModule
})
export class FlowQuery extends QueryEntity<FlowState, Flow> {
  constructor(protected store: FlowStore) {
    super(store);
  }
}
