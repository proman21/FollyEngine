import { QueryEntity } from "@datorama/akita";
import { DesignerEntityState, DesignerEntityStore } from "./entity.store";
import { DesignerEntity } from "./entity.model";
import { Injectable } from "@angular/core";
import { StateModule } from "../state.module";

@Injectable({
  providedIn: StateModule
})
export class DesignerEntityQuery extends QueryEntity<DesignerEntityState, DesignerEntity> {
  constructor(protected store: DesignerEntityStore) {
    super(store);
  }
}
