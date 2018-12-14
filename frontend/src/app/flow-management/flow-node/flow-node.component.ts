import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit, ViewChild} from "@angular/core";
import { Node as FlowNode, Vector2 } from "../../designer/flow-graph";
import {
  ALIGN_FLEX_END,
  EDGE_ALL,
  EDGE_BOTTOM, EDGE_LEFT,
  EDGE_RIGHT,
  FLEX_DIRECTION_COLUMN, FLEX_DIRECTION_ROW_REVERSE, JUSTIFY_SPACE_BETWEEN,
  Node,
  YogaNode
} from "yoga-layout";
import { Subscription } from "rxjs";
import { FlowEditorService } from "../flow-editor.service";
import { filter, map } from "rxjs/operators";
import { ControlPin } from "../../flow/types";

class NodeLayout {
  root: YogaNode;
  header: YogaNode;
  header_icon: YogaNode;
  header_title: YogaNode;
  body: YogaNode;
  body_inputs: YogaNode;
  body_outputs: YogaNode;

  constructor(title_measure: () => any) {
    this.root = Node.createDefault();
    this.root.setFlexDirection(FLEX_DIRECTION_COLUMN);
    this.root.setWidthAuto();
    this.root.setHeightAuto();

    this.header = Node.createDefault();
    this.header.setHeightAuto();
    this.header.setWidthAuto();
    this.header.setPadding(EDGE_ALL, 8);
    this.header.setMargin(EDGE_BOTTOM, 8);
    this.root.insertChild(this.header, 0);

    this.header_icon = Node.createDefault();
    this.header_icon.setWidth(30);
    this.header_icon.setHeight(25);
    this.header_icon.setMargin(EDGE_RIGHT, 8);
    this.header.insertChild(this.header_icon, 0);

    this.header_title = Node.createDefault();
    this.header_title.setMeasureFunc(title_measure);
    this.header.insertChild(this.header_title, 1);

    this.body = Node.createDefault();
    this.body.setHeightAuto();
    this.body.setWidthAuto();
    this.body.setJustifyContent(JUSTIFY_SPACE_BETWEEN);
    this.root.insertChild(this.body, 1);

    this.body_inputs = Node.createDefault();
    this.body_inputs.setWidthAuto();
    this.body_inputs.setHeightAuto();
    this.body_inputs.setFlexDirection(FLEX_DIRECTION_COLUMN);
    this.body_inputs.setMargin(EDGE_RIGHT, 4);
    this.body.insertChild(this.body_inputs, 0);

    this.body_outputs = Node.createDefault();
    this.body_outputs.setWidthAuto();
    this.body_outputs.setHeightAuto();
    this.body_outputs.setFlexDirection(FLEX_DIRECTION_COLUMN);
    this.body_outputs.setMargin(EDGE_LEFT, 4);
    this.body_outputs.setAlignItems(ALIGN_FLEX_END);
    this.body.insertChild(this.body_outputs, 1);
  }
}

@Component({
  selector: '[flow-node]',
  templateUrl: './flow-node.component.html',
  styleUrls: [ './flow-node.component.css' ],
})
export class FlowNodeComponent implements OnInit, AfterViewInit {
  @Input() node: FlowNode;
  @ViewChild('title') title: ElementRef<SVGTextElement>;
  private layout: NodeLayout;
  private dragSub: Subscription;

  get selected() {
    return this.flowService.selectedNodes.includes(this.node);
  }

  get transform() {
    return `translate(${this.node.position.x}, ${this.node.position.y})`;
  }

  get descriptor() {
    return this.node.descriptor;
  }

  constructor(private cd: ChangeDetectorRef,
              private flowService: FlowEditorService) {
    this.flowService.focusEvents$.pipe(
      filter(f => f === false)
    ).subscribe(() => this.stopDrag());
  }

  ngOnInit(): void {
    this.layout = new NodeLayout(() => this.getTitleRect());
  }

  ngAfterViewInit() {
    this.layout.root.calculateLayout();
    this.cd.detectChanges();
  }

  startDrag(ev: MouseEvent) {
    if (this.node == null) {
      console.error("startDrag operation called with no assigned Node.");
      return;
    }
    // If an existing drag operation is occuring, cancel it and abort.
    // This indicates a mouse event didn't fire.
    if (this.stopDrag()) {
      return;
    }

    const mousePos = new Vector2(ev.clientX, ev.clientY);
    const offset = this.flowService.transformGlobalCoords(mousePos)
      .subtract(this.node.position);

    this.dragSub = this.flowService.mousePosition$.pipe(
      map(p => p.subtract(offset))
    ).subscribe(p => this.node.position = p);
    ev.preventDefault();
  }

  stopDrag() {
    if (this.dragSub) {
      this.dragSub.unsubscribe();
      this.dragSub = null;
      return true;
    }
    return false;
  }

  selectNode(ev: MouseEvent) {
    this.flowService.selectNode(this.node);
    ev.stopPropagation();
  }

  createInputPinNode(index: number): YogaNode {
    const node = Node.createDefault();
    this.layout.body_inputs.insertChild(node, index);
    return node;
  }

  createOutputPinNode(index: number): YogaNode {
    const node = Node.createDefault();
    node.setFlexDirection(FLEX_DIRECTION_ROW_REVERSE);
    node.setAlignItems(ALIGN_FLEX_END);
    this.layout.body_outputs.insertChild(node, index);
    return node;
  }

  private getTitleRect(): DOMRect {
    return this.title.nativeElement.getBBox();
  }
}
