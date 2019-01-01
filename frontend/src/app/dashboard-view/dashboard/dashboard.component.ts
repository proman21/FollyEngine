import { Component, OnInit} from '@angular/core';
import { MatDialog } from "@angular/material";
import { Router } from "@angular/router";
import { ProjectsService } from "../../state/project/project.service";
import { ProjectsQuery } from "../../state/project/project.query";
import { filter, mergeMap } from "rxjs/operators";
import { NewProjectComponent } from "../new-project/new-project.component";
import { filterNil } from "@datorama/akita";

@Component({
  selector: 'app-welcome-dialog',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  constructor(
    private projectsService: ProjectsService,
    public projectsQuery: ProjectsQuery,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.projectsService.loadProjects();
  }

  openNewProjectView() {
    this.dialog.open(NewProjectComponent).afterClosed().pipe(
      filterNil,
      mergeMap(p => {
        this.projectsService.newProject(p);
        return this.projectsQuery.selectActive();
      })
    ).subscribe(proj => {
      this.router.navigate(['projects', proj.slug]);
    });
  }
}
