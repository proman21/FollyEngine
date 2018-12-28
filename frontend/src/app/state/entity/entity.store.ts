import { ActiveState, EntityState, EntityStore, getInitialActiveState, StoreConfig } from "@datorama/akita";
import { DesignerEntity } from "./entity.model";
import { Injectable } from "@angular/core";
import { StateModule } from "../state.module";

export interface DesignerEntityState extends EntityState<DesignerEntity>, ActiveState {}

const initialState = {
  ...getInitialActiveState()
};

@Injectable({
  providedIn: StateModule
})
@StoreConfig({ name: 'entities' })
export class DesignerEntityStore extends EntityStore<DesignerEntityState, DesignerEntity> {
  constructor() {
    super(initialState);
  }
}
