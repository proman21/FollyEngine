import { Component, OnInit, ViewChild} from "@angular/core";
import { MatDrawer, MatTreeFlatDataSource, MatTreeFlattener } from "@angular/material";

import { FlatTreeControl } from "@angular/cdk/tree";
import { Observable, of } from "rxjs";
import { CatNode, FlowEditorService } from "../../../state/flow/editor/flow-editor.service";
import { FlowPaperComponent } from "./flow-paper/flow-paper.component";
import { FlowService } from "../../../state/flow/flow.service";
import { FlowQuery } from "../../../state/flow/flow.query";
import { IFlowGraph } from "../../../state/flow/editor/serialisation";

export class FlatCatNode {
  constructor(
    public expandable: boolean,
    public id: string,
    public name: string,
    public description: string,
    public level: number) {
  }
}

@Component({
  selector: "flow-editor",
  templateUrl: "./flow-editor.component.html",
  styleUrls: ["./flow-editor.component.css"]
})
export class FlowEditorComponent implements OnInit {
  get flow() {
    return this.flowQuery.getActive();
  }

  @ViewChild(MatDrawer) drawer: MatDrawer;
  @ViewChild(FlowPaperComponent) flowPaper: FlowPaperComponent;

  catTreeControl: FlatTreeControl<FlatCatNode>;
  catTreeFlattener: MatTreeFlattener<CatNode, FlatCatNode>;
  catDataSource: MatTreeFlatDataSource<CatNode, FlatCatNode>;

  transformer = (cat: CatNode, level: number) => {
    return new FlatCatNode(cat.children.length > 0, cat.id, cat.name,
      cat.description, level);
  };
  private _getLevel = (cat: FlatCatNode) => cat.level;
  private _isExpandable = (cat: FlatCatNode) => cat.expandable;
  private _getChildren = (cat: CatNode): Observable<CatNode[]> => of(cat.children);
  hasChild = (_: number, _nodeData: FlatCatNode) => _nodeData.expandable;

  constructor(
    private flowService: FlowService,
    private flowQuery: FlowQuery,
    private flowEditorService: FlowEditorService
  ) {
    this.catTreeFlattener = new MatTreeFlattener(this.transformer, this._getLevel,
      this._isExpandable, this._getChildren);
    this.catTreeControl = new FlatTreeControl<FlatCatNode>(this._getLevel, this._isExpandable);
    this.catDataSource = new MatTreeFlatDataSource(this.catTreeControl, this.catTreeFlattener);
    this.catDataSource.data = this.flowEditorService.categoryTree;
  }

  ngOnInit(): void {}

  createNode(nodeDef: FlatCatNode) {
    this.drawer.close();
    this.flowPaper.createNode(nodeDef.id);
  }

  saveFlowGraph(graph: IFlowGraph) {
    this.flowService.saveFlowGraph(graph);
  }
}
