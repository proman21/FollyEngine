import { ActiveState, EntityState, EntityStore, getInitialActiveState, StoreConfig } from "@datorama/akita";
import { Flow } from "./flow.model";
import { Injectable } from "@angular/core";
import { StateModule } from "../state.module";

export interface FlowState extends EntityState<Flow>, ActiveState {}

const initialState = {
  ...getInitialActiveState()
};

@Injectable({
  providedIn: StateModule
})
@StoreConfig({ name: "flows" })
export class FlowStore extends EntityStore<FlowState, Flow> {
  constructor() {
    super(initialState);
  }
}
