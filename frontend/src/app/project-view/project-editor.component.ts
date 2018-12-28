import { Component, ComponentFactoryResolver, OnInit, Type, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { SettingsDialogComponent } from "./settings-dialog/settings-dialog.component";
// Angular Material
import { MatDialog } from "@angular/material";
import { FlowEditorService } from "../state/flow/editor/flow-editor.service";
import { EditorHostDirective } from "./editors/editor-host.directive";
import { ProjectsService } from "../state/project/project.service";
import { ProjectsQuery } from "../state/project/project.query";
import { SessionQuery } from "../auth/auth.query";
import { EntityService } from "../state/entity/entity.service";
import { ComponentService } from "../state/component/component.service";
import { FlowService } from "../state/flow/flow.service";
import { DesignerResource } from "../state/designer";
import { EntityEditorComponent } from "./editors/entity-editor/entity-editor.component";
import { ComponentEditorComponent } from "./editors/component-editor/component-editor.component";
import { DesignerEntityQuery } from "../state/entity/entity.query";
import { ComponentQuery } from "../state/component/component.query";
import { FlowEditorComponent } from "./editors/flow-editor/flow-editor.component";
import { FlowQuery } from "../state/flow/flow.query";
import { Observable } from "rxjs";
import { QueryEntity } from "@datorama/akita";

export class ResourceView<T extends DesignerResource> {
  active = false;

  constructor(
    public name: string,
    public query: Observable<T[]>,
    public getCurrent: () => T,
    public createResource: () => void,
    public openResource: (ID) => void,
    public editorComponent: Type<any>
  ) {}
}

@Component({
  selector: 'app-project-editor',
  templateUrl: './project-editor.component.html',
  styleUrls: ['./project-editor.component.css'],
  providers: [
    EntityService,
    ComponentService,
    FlowService
  ]
})
export class ProjectEditorComponent implements OnInit {
  get project() {
    return this.projectsQuery.getActive();
  }

  get username() {
    return this.sessionQuery.getSnapshot().name;
  }

  sidebarExpanded = true;

  resourceViews: ResourceView<DesignerResource>[];
  resourceViewIndex = 0;
  get currentResourceView() {
    return this.resourceViews[this.resourceViewIndex];
  }
  bindingVar = '';

  @ViewChild(EditorHostDirective) editorHost: EditorHostDirective;

  constructor(
    private projectsService: ProjectsService,
    public projectsQuery: ProjectsQuery,
    public sessionQuery: SessionQuery,
    private entityService: EntityService,
    public entityQuery: DesignerEntityQuery,
    private componentService: ComponentService,
    public componentQuery: ComponentQuery,
    private flowService: FlowService,
    public flowQuery: FlowQuery,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    public flowEditorService: FlowEditorService,
    private compFactoryResolver: ComponentFactoryResolver
  ) {
    route.params.subscribe(({id}) => {
      this.projectsService.openProject(id);
    });
    this.flowEditorService.initialise();
  }

  ngOnInit(): void {
    this.resourceViews = [
      new ResourceView(
        "Entities",
        this.entityQuery.selectAll(),
        () => this.entityQuery.getActive(),
        () => this.entityService.newEntity(),
        (id) => this.entityService.openEntity(id),
        EntityEditorComponent
      ),
      new ResourceView(
        "Components",
        this.componentQuery.selectAll(),
        () => this.componentQuery.getActive(),
        () => this.componentService.newComponent(),
        (id) => this.componentService.openComponent(id),
        ComponentEditorComponent
      ),
      new ResourceView(
        "Flows",
        this.flowQuery.selectAll(),
        () => this.flowQuery.getActive(),
        () => this.flowService.newFlow(),
        (id) => this.flowService.openFlow(id),
        FlowEditorComponent
      )
    ]
  }

  setResourceView(val: number) {
    this.currentResourceView.active = false;
    this.resourceViewIndex = val;
    this.currentResourceView.active = true;
    this.openEditor();
    this.fadeIn();
  }

  openResource(id: number) {
    this.currentResourceView.openResource(id);
    this.openEditor();
  }

  openEditor() {
    const compFactory = this.compFactoryResolver.resolveComponentFactory(this.currentResourceView.editorComponent);
    const viewContainerRef = this.editorHost.viewContainerRef;
    viewContainerRef.clear();
    if (this.currentResourceView.getCurrent()) {
      viewContainerRef.createComponent(compFactory);
    }
  }

  fadeIn() {
    this.bindingVar = 'fadeIn';
  }

  displaySettingsDialog() {
    this.dialog.open(SettingsDialogComponent, {
      disableClose: true,
      autoFocus: false,
      minWidth: 800,
      minHeight: 600,
      hasBackdrop: true
    }).afterClosed().subscribe(() => {
      // TODO: Save settings changes after close
    });
  }

  toggleSideBar() {
    this.sidebarExpanded = !this.sidebarExpanded;
  }
}
