import { Autoregister, DocumentCollection, Resource, Service } from "ngx-jsonapi";
import { Injectable } from "@angular/core";
import { ApiComponent } from "./component-data.service";
import { ApiEntity } from "./entity-data.service";
import { ApiFlow } from "./flow-data.service";

export class ApiProject extends Resource {
  attributes = {
    title: 'New Project',
    description: '',
    slug: ''
  };

  relationships = {
    entities: new DocumentCollection<ApiEntity>(),
    components: new DocumentCollection<ApiComponent>(),
    flows: new DocumentCollection<ApiFlow>()
  };
}

@Injectable()
@Autoregister()
export class ProjectDataService extends Service<ApiProject> {
  resource = ApiProject;
  type = 'projects';
}
