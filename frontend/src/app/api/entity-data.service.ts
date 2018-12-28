import { Autoregister, DocumentCollection, Resource, Service } from "ngx-jsonapi";
import { Injectable } from "@angular/core";
import { ApiComponent } from "./component-data.service";

export class ApiEntity extends Resource {
  attributes = {
    name: 'New Entity',
    description: ''
  };

  relationships = {
    components: new DocumentCollection<ApiComponent>()
  }
}

@Injectable()
@Autoregister()
export class EntityDataService extends Service<ApiEntity> {
  resource = ApiEntity;
  type = 'entities';
}
