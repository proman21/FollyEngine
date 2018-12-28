import { Autoregister, Resource, Service } from "ngx-jsonapi";
import { Injectable } from "@angular/core";
import { emptyIGraph} from "../state/flow/editor/serialisation";

export class ApiFlow extends Resource {
  attributes = {
    name: 'New Flow',
    description: '',
    graph: emptyIGraph
  };
}

@Injectable()
@Autoregister()
export class FlowDataService extends Service<ApiFlow> {
  resource = ApiFlow;
  type = 'flows';
}
