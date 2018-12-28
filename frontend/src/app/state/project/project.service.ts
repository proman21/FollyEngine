import { ProjectsStore } from "./project.store";
import { Injectable } from "@angular/core";
import { createProject} from "./project.model";
import { ProjectsQuery } from "./project.query";
import { applyTransaction} from "@datorama/akita";
import { ProjectDataService } from "../../api/project-data.service";
import { StateModule } from "../state.module";

interface ProjectInput {
  title: string,
  description: string
}

@Injectable({
  providedIn: StateModule
})
export class ProjectsService {
  constructor(private projectDataService: ProjectDataService,
              private projectsStore: ProjectsStore,
              private projectsQuery: ProjectsQuery) {}

  newProject({title, description}: ProjectInput) {
    const project = this.projectDataService.new();
    project.attributes.title = title;
    project.attributes.description = description;
    project.save().subscribe(res => {
      applyTransaction(() => {
        this.projectsStore.add(createProject({id: project.id, ...project.attributes}));
        this.projectsStore.setActive(project.id);
      })
    }, err => {
      this.projectsStore.setError(err);
    });
  }

  loadProjects() {
    this.projectDataService.all().subscribe(projs => {
      this.projectsStore.add(projs.data.map(proj => {
        return createProject({id: proj.id, ...proj.attributes});
      }));
    }, err => {
      this.projectsStore.setError(err);
    });
  }

  openProject(slug: string) {
    const project = this.projectsQuery.getAll({
      filterBy: p => p.slug === slug,
      limitTo: 1
    });
    if (project.length === 0) {
      this.projectDataService.get(slug).subscribe(proj => {
        applyTransaction(() => {
          this.projectsStore.add(createProject({
            id: proj.id,
            ...proj.attributes
          }));
          this.projectsStore.setActive(proj.id)
        });
      }, err => {
        this.projectsStore.setError(err);
      });
    } else {
      this.projectsStore.setActive(project[0].id);
    }
  }
}
