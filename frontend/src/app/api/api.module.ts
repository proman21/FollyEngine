import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentDataService } from "./component-data.service";
import { EntityDataService } from "./entity-data.service";
import { FlowDataService } from "./flow-data.service";
import { ProjectDataService } from "./project-data.service";
import { NgxJsonapiModule } from "ngx-jsonapi";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NgxJsonapiModule.forRoot({
      url: '/api/'
    })
  ],
  providers: [
    ComponentDataService,
    EntityDataService,
    FlowDataService,
    ProjectDataService
  ]
})
export class ApiModule {
  constructor(
    public componentDataService: ComponentDataService,
    public entityDataService: EntityDataService,
    public flowDataService: FlowDataService,
    public projectDataService: ProjectDataService
  ) {
    componentDataService.register();
    entityDataService.register();
    flowDataService.register();
    projectDataService.register();
  }
}
