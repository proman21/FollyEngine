import { Autoregister, Resource, Service } from "ngx-jsonapi";
import { Injectable } from "@angular/core";
import { Attribute } from "../state/component/component.model";
import { StateModule } from "../state/state.module";

export class ApiComponent extends Resource {
  attributes = {
    name: 'New Component',
    description: '',
    attributes: <Attribute[]> [],
  };
}

@Injectable()
@Autoregister()
export class ComponentDataService extends Service<ApiComponent> {
  resource = ApiComponent;
  type = 'components';
}
