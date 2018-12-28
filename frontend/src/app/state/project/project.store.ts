import { ActiveState, EntityState, EntityStore, getInitialActiveState, StoreConfig } from "@datorama/akita";
import { Project } from "./project.model";
import { Injectable } from "@angular/core";
import { StateModule } from "../state.module";

export interface ProjectsState extends EntityState<Project>, ActiveState {}

const initialState = {
  ...getInitialActiveState()
};

@Injectable({
  providedIn: StateModule
})
@StoreConfig({ name: 'projects' })
export class ProjectsStore extends EntityStore<ProjectsState, Project> {
  constructor() {
    super(initialState);
  }
}
