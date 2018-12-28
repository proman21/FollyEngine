import { ActiveState, EntityState, EntityStore, getInitialActiveState, StoreConfig } from "@datorama/akita";
import { DesignerComponent } from "./component.model";
import { Injectable } from "@angular/core";
import { StateModule } from "../state.module";

export interface ComponentState extends EntityState<DesignerComponent> {}

const initialState = {
  ...getInitialActiveState()
};

@Injectable({
  providedIn: StateModule
})
@StoreConfig({ name: 'components '})
export class ComponentStore extends EntityStore<ComponentState, DesignerComponent> {
  constructor() {
    super(initialState);
  }
}
