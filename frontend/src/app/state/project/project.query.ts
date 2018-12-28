import { Injectable } from "@angular/core";
import { QueryEntity } from "@datorama/akita";
import { ProjectsState, ProjectsStore } from "./project.store";
import { Project } from "./project.model";
import { StateModule } from "../state.module";

@Injectable({
  providedIn: StateModule
})
export class ProjectsQuery extends QueryEntity<ProjectsState, Project> {
  get projectPath() {
    return `projects/${this.getActive().slug}`;
  }

  constructor(protected store: ProjectsStore) {
    super(store);
  }
}
