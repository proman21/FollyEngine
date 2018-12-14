import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { FlowGraph, Node, Vector2 } from "../designer/flow-graph";
import { FlowService } from "../flow/flow.service";

@Injectable({
  providedIn: 'root'
})
export class FlowEditorService {
  scale = 1.0;
  mousePosition$ = new BehaviorSubject(new Vector2(0, 0));;
  selectedNodes: Node[] = [];
  focusEvents$ = new BehaviorSubject<boolean>(false);
  flow: FlowGraph;
  ctm = new DOMMatrix();

  get categoryTree() {
    return this.flowService.categoryTree;
  }

  constructor(private flowService: FlowService) {
  }

  setCTM(matrix: DOMMatrix) {
    this.ctm = matrix;
  }

  setFlow(flow: FlowGraph) {
    this.flow = flow;
  }

  transformGlobalCoords(pos: Vector2): Vector2 {
    return new Vector2((pos.x - this.ctm.e) / this.ctm.a,
      (pos.y - this.ctm.f) / this.ctm.d);
  }

  updateMousePosition(pos: Vector2) {
    this.mousePosition$.next(this.transformGlobalCoords(pos));
  }

  setFocus(focus: boolean) {
    this.focusEvents$.next(focus);
  }

  selectNode(node: Node) {
    this.selectedNodes = [node];
  }

  deselectAll() {
    this.selectedNodes = [];
  }
}
