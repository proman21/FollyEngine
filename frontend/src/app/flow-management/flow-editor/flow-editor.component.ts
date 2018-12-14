import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit, Renderer2,
  ViewChild
} from "@angular/core";
import { MatDrawer, MatMenuTrigger, MatTreeFlatDataSource, MatTreeFlattener } from "@angular/material";

import { DesignerFlow } from "../../designer/designer";
import { FlowEditorService } from "../flow-editor.service";
import { Vector2 } from "../../designer/flow-graph";
import { FlatTreeControl } from "@angular/cdk/tree";
import { Observable, of } from "rxjs";
import { CatNode } from "../../flow/flow.service";

class Viewport {
  constructor(public origin: Vector2, public dimensions: Vector2) {}

  get viewBox(): string {
    return `${this.origin.x} ${this.origin.y} ${this.dimensions.x} ${this.dimensions.y}`;
  }
}

export class FlatCatNode {
  constructor(
    public expandable: boolean,
    public name: string,
    public description: string,
    public level: number) {
  }
}

@Component({
  selector: "flow-editor",
  templateUrl: "./flow-editor.component.html",
  styleUrls: ["./flow-editor.component.css"],
  providers: [ FlowEditorService ]
})
export class FlowEditorComponent implements OnInit, AfterViewInit {
  @Input()
  flow: DesignerFlow;
  @ViewChild("flowPaper")
  private flowPaper: ElementRef<SVGGraphicsElement>;
  viewport: Viewport;

  @ViewChild(MatMenuTrigger) ctxTrigger: MatMenuTrigger;
  ctxPos = Vector2.ORIGIN;
  get ctxMenuStyle() {
    return {'left.px': this.ctxPos.x, 'top.px': this.ctxPos.y};
  }

  @ViewChild(MatDrawer) drawer: MatDrawer;

  catTreeControl: FlatTreeControl<FlatCatNode>;
  catTreeFlattener: MatTreeFlattener<CatNode, FlatCatNode>;
  catDataSource: MatTreeFlatDataSource<CatNode, FlatCatNode>;
  transformer = (cat: CatNode, level: number) => {
    return new FlatCatNode(cat.children.length > 0, cat.name,
      cat.description, level);
  };
  private _getLevel = (cat: FlatCatNode) => cat.level;
  private _isExpandable = (cat: FlatCatNode) => cat.expandable;
  private _getChildren = (cat: CatNode): Observable<CatNode[]> => of(cat.children);
  hasChild = (_: number, _nodeData: FlatCatNode) => _nodeData.expandable;

  constructor(
    private editorService: FlowEditorService,
    private cd: ChangeDetectorRef,
    private rndr: Renderer2
  ) {
    this.catTreeFlattener = new MatTreeFlattener(this.transformer, this._getLevel,
      this._isExpandable, this._getChildren);
    this.catTreeControl = new FlatTreeControl<FlatCatNode>(this._getLevel, this._isExpandable);
    this.catDataSource = new MatTreeFlatDataSource(this.catTreeControl, this.catTreeFlattener);
    this.catDataSource.data = this.editorService.categoryTree;
  }

  ngOnInit(): void {
    this.viewport = new Viewport(Vector2.ORIGIN, Vector2.ORIGIN);
    if (this.flow) {
      this.editorService.setFlow(this.flow.data);
    }
  }

  ngAfterViewInit(): void {
    const containerRect = this.flowPaper.nativeElement.getBoundingClientRect();
    this.updateViewboxDim(new Vector2(containerRect.width, containerRect.height));
    this.cd.detectChanges();
  }

  trackDrag(ev: MouseEvent) {
    this.editorService.updateMousePosition(new Vector2(ev.clientX, ev.clientY));
  }

  setFocus(focus: boolean) {
    this.editorService.setFocus(focus);
  }

  deselect(ev: MouseEvent) {
    this.editorService.deselectAll();
    ev.stopPropagation();
  }

  showContextMenu(ev: MouseEvent) {
    this.ctxPos.x = ev.layerX;
    this.ctxPos.y = ev.layerY;
    this.ctxTrigger.openMenu();
    ev.preventDefault();
  }

  showNodeSelector() {
    this.drawer.open();
  }

  private updateViewboxDim(dim: Vector2) {
    this.viewport.dimensions = dim;
    this.rndr.setAttribute(this.flowPaper.nativeElement, 'viewBox',
      this.viewport.viewBox);
    this.editorService.setCTM(this.flowPaper.nativeElement.getScreenCTM());
  }
}
