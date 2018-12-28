import { QueryEntity } from "@datorama/akita";
import { ComponentState, ComponentStore } from "./component.store";
import { DesignerComponent } from "./component.model";
import { Injectable } from "@angular/core";
import { StateModule } from "../state.module";

@Injectable({
  providedIn: StateModule
})
export class ComponentQuery extends QueryEntity<ComponentState, DesignerComponent> {
  constructor(protected store: ComponentStore) {
    super(store);
  }
}
