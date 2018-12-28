import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
  ViewChild
} from "@angular/core";
import { FlowGraph, Node as FlowNode, Variable, Vector2 } from "../../../../state/flow/editor/flow-graph";
import { MatMenuTrigger } from "@angular/material";
import { map } from "rxjs/operators";
import { BehaviorSubject, Observable, Subscription } from "rxjs";
import {
  ALIGN_FLEX_END,
  ALIGN_FLEX_START,
  FLEX_DIRECTION_COLUMN,
  FLEX_DIRECTION_ROW,
  FLEX_DIRECTION_ROW_REVERSE,
  JUSTIFY_CENTER,
  JUSTIFY_SPACE_BETWEEN,
  Layout} from "yoga-layout";
import { FlowEditorService } from "../../../../state/flow/editor/flow-editor.service";
import { YogaLayoutOptions } from "./yoga-layout.directive";
import { ControlPin, DataPin, Pin } from "../../../../state/flow/editor/types";
import { FlowService } from "../../../../state/flow/flow.service";
import { IFlowGraph } from "../../../../state/flow/editor/serialisation";

class Viewport {
  constructor(public origin: Vector2, public dimensions: Vector2) {}

  get viewBox(): string {
    return `${this.origin.x} ${this.origin.y} ${this.dimensions.x} ${this.dimensions.y}`;
  }
}

class PinLayout {
  root: YogaLayoutOptions;
  icon: YogaLayoutOptions;
  label: YogaLayoutOptions;

  constructor(pin: YogaLayoutOptions) {
    this.root = pin;

    this.icon = {
      width: 4,
      height: 4,
      margin: { horizontal: 1 }
    };

    this.label = {};
  }

  static inputPin() {
    return new PinLayout({
      width: 'auto',
      height: 'auto',
      margin: { all: 1 },
      flexDirection: FLEX_DIRECTION_ROW,
      justifyContent: JUSTIFY_CENTER
    });
  }

  static outputPin() {
    return new PinLayout({
      width: 'auto',
      height: 'auto',
      margin: { all: 1 },
      flexDirection: FLEX_DIRECTION_ROW_REVERSE,
      justifyContent: JUSTIFY_CENTER
    });
  }
}

interface PinView {
  connected: boolean;
  layout: PinLayout;
  pin: Pin;
  name: string;

  isControl(): boolean;
}

class DataPinView implements PinView {
  connected = false;

  constructor(
    public name: string,
    public pin: DataPin,
    public layout: PinLayout
  ) {}

  isControl(): boolean {
    return false;
  }
}

class ControlPinView implements PinView {
  connected = false;

  constructor(
    public name: string,
    public pin: ControlPin,
    public layout: PinLayout
  ) {}

  isControl(): boolean {
    return true;
  }
}

class NodeLayout {
  root: YogaLayoutOptions;
  header: YogaLayoutOptions;
  header_icon: YogaLayoutOptions;
  header_title: YogaLayoutOptions;
  body: YogaLayoutOptions;
  body_inputs: YogaLayoutOptions;
  body_outputs: YogaLayoutOptions;

  constructor() {
    this.root = {
      flexDirection: FLEX_DIRECTION_COLUMN,
      width: 'auto',
      height: 'auto'
    };

    this.header = {
      height: 'auto',
      width: 'auto',
      padding: { all: 2 },
      flexDirection: FLEX_DIRECTION_ROW
    };

    this.header_icon = {
      width: 8,
      height: 8,
      margin: { right: 2 }
    };

    this.header_title = {};

    this.body = {
      height: 'auto',
      width: 'auto',
      justifyContent: JUSTIFY_SPACE_BETWEEN,
      flexDirection: FLEX_DIRECTION_ROW,
      padding: { all: 2 }
    };

    this.body_inputs = {
      width: 'auto',
      height: 'auto',
      flexDirection: FLEX_DIRECTION_COLUMN,
      margin: { right: 2 },
      alignItems: ALIGN_FLEX_START
    };

    this.body_outputs = {
      width: 'auto',
      height: 'auto',
      flexDirection: FLEX_DIRECTION_COLUMN,
      margin: { left: 2 },
      alignItems: ALIGN_FLEX_END
    };
  }
}

class NodeView {
  dragSub: Subscription;
  layout: NodeLayout;
  selected = false;
  pinViews: {
    inputs: Map<string, PinView>,
    outputs: Map<string, PinView>
  };

  get transform() {
    return `translate(${this.node.position.x}, ${this.node.position.y})`;
  }

  get descriptor() {
    return this.node.descriptor;
  }

  constructor(public id: number, public node: FlowNode) {
    this.layout = new NodeLayout();
    this.pinViews = {
      inputs: this.makePinViews(node.descriptor.inputs, PinLayout.inputPin),
      outputs: this.makePinViews(node.descriptor.outputs, PinLayout.outputPin)
    };
  }

  private makePinViews(set: Map<string, Pin>, pinLayout: () => PinLayout): Map<string, PinView> {
    return new Map(Array.from(set.entries()).map(([name, pin]) => {
      let res: [string, PinView] = [name, null];

      if (pin instanceof DataPin) {
        res = [name, new DataPinView(name, pin, pinLayout())];
      }
      if(pin instanceof ControlPin) {
        res = [name, new ControlPinView(name, pin, pinLayout())];
      }

      return res;
    }));
  }

  startDrag(pos: Vector2, mousePos: Observable<Vector2>) {
    // If an existing drag operation is occurring, cancel it and abort.
    // This indicates a mouse event didn't fire.
    if (this.stopDrag()) {
      return;
    }

    const offset = pos.subtract(this.node.position);
    this.dragSub = mousePos.pipe(
      map(p => p.subtract(offset))
    ).subscribe(p => this.node.position = p);
  }

  stopDrag() {
    if (this.dragSub) {
      this.dragSub.unsubscribe();
      this.dragSub = null;
      return true;
    }
    return false;
  }
}

class ConnectionView {
  constructor(
    public to: [NodeView, PinView],
    public from: [NodeView, PinView],
    public color: [number, number, number]
  ) {}
}

class ConnectionHelper {
  endPos = Vector2.ORIGIN;
  to: [NodeView, [string, PinView]];
  positionTracker: Subscription;
  tooltipLayout: YogaLayoutOptions = {
    width: 'auto',
    height: 'auto',
    flexDirection: FLEX_DIRECTION_ROW,
    padding: { all: 1, start: 4 }
  };
  connectionAllowed = true;
  errorMsg = '';

  get tooltipTransform() {
    return `translate(${this.endPos.x}, ${this.endPos.y})`;
  }

  get fromView() {
    return this.from[0];
  }

  get fromPath() {
    return this.from[1];
  }

  get toView() {
    return this.to[0];
  }

  get toPath() {
    return this.to[1];
  }

  constructor(public positionUpdates: Observable<Vector2>,
              public startPos: Vector2,
              public from: [NodeView, [string, PinView]]) {
    this.endPos = Vector2.ORIGIN.copy(startPos);
    this.positionTracker = this.positionUpdates.subscribe(
      (p) => this.endPos.copy(p));
  }

  stopConnecting() {
    this.positionTracker.unsubscribe();
  }

  setConnectionTo(n: NodeView, direction: string, pin: PinView): void {
    this.to = [n, [direction, pin]];
    this.connectionAllowed = this.canConnect();
  }

  clearConnectionTo() {
    this.to = null;
    this.connectionAllowed = true;
    this.errorMsg = '';
  }

  canConnect(): boolean {
    if(this.to === null) return true;

    if (this.toPath[0] !== this.fromPath[0]) {
      if(this.fromPath[1].pin.kind === this.toPath[1].pin.kind) {
        return true;
      } else {
        this.errorMsg = `${this.fromPath[1].pin.kind} is not compatible with ${this.toPath[1].pin.kind}`;
      }
    } else {
      this.errorMsg = `Cannot connect ${this.fromPath[0]} to ${this.toPath[0]}`;
    }
    return false;
  }
}

@Component({
  selector: 'app-flow-paper',
  templateUrl: './flow-paper.component.html',
  styleUrls: ['./flow-paper.component.css']
})
export class FlowPaperComponent implements OnInit, AfterViewInit {
  @Input()
  graphData: IFlowGraph;
  graph: FlowGraph;

  scale = 1.0;
  mousePosition$ = new BehaviorSubject(new Vector2(0, 0));
  focusEvents$ = new BehaviorSubject<boolean>(false);
  connectionHelper: ConnectionHelper;

  get selectedNodes() {
    return Array.from(this.nodeViews.values()).filter(n => n.selected);
  }

  nodeViews: Map<FlowNode, NodeView>;
  get nodeViewSet() {
    return Array.from(this.nodeViews.values());
  }
  linkViews: Map<FlowNode, ConnectionView>;
  reverseViews: Map<FlowNode, ConnectionView>;

  @ViewChild("flowPaper")
  private flowPaper: ElementRef<SVGGraphicsElement>;
  viewport = new Viewport(Vector2.ORIGIN, Vector2.ORIGIN);
  get ctm() {
    return this.flowPaper.nativeElement.getScreenCTM();
  }

  @ViewChild(MatMenuTrigger) ctxTrigger: MatMenuTrigger;
  ctxPos = Vector2.ORIGIN;
  newNodePos = Vector2.ORIGIN;
  get ctxMenuStyle() {
    return {'left.px': this.ctxPos.x, 'top.px': this.ctxPos.y};
  }

  @Output()
  openNodeSelector = new EventEmitter<void>();
  @Output()
  saveGraph = new EventEmitter<IFlowGraph>();

  constructor(
    private flowEditorService: FlowEditorService,
    private cd: ChangeDetectorRef,
    private rndr: Renderer2
  ) {
    this.nodeViews = new Map();
  }

  ngOnInit() {
    console.log(this.graphData);
    this.graph = this.deserializeFlowGraph();
    for(const [id, n] of this.graph.nodes.entries()) {
      this.nodeViews.set(n, new NodeView(id, n));
    }
    this.cd.detectChanges();
  }

  ngAfterViewInit(): void {
    const containerRect = this.flowPaper.nativeElement.getBoundingClientRect();
    this.viewport.dimensions.copy(new Vector2(containerRect.width,
      containerRect.height));
    this.updateViewbox();
    this.cd.detectChanges();
  }

  trackDrag(ev: MouseEvent) {
    this.mousePosition$.next(
      this.transformGlobalCoords(new Vector2(ev.clientX, ev.clientY)));
  }

  deselect(ev: MouseEvent) {
    this.clearSelection();
    ev.stopPropagation();
  }

  selectNode(node: NodeView, ev: MouseEvent) {
    if (ev.ctrlKey) {
      node.selected = !node.selected;
    } else if (ev.shiftKey) {
      node.selected = true;
    } else {
      this.clearSelection();
      node.selected = true;
    }
    ev.stopPropagation();
  }

  clearSelection() {
    for (const n of this.selectedNodes) {
      n.selected = false;
    }
  }

  startNodeDrag(node: NodeView, ev: MouseEvent) {
    const mousePos = new Vector2(ev.clientX, ev.clientY);
    node.startDrag(this.transformGlobalCoords(mousePos), this.mousePosition$);
    ev.preventDefault();
  }

  stopNodeDrag(n: NodeView) {
    n.stopDrag();
    this.saveGraph.emit(this.graph.serialize());
  }

  showContextMenu(ev: MouseEvent) {
    this.newNodePos = this.transformGlobalCoords(
      new Vector2(ev.x, ev.y));
    this.ctxPos.x = ev.layerX;
    this.ctxPos.y = ev.layerY;
    this.ctxTrigger.openMenu();
    ev.preventDefault();
  }

  private updateViewbox() {
    this.rndr.setAttribute(this.flowPaper.nativeElement, 'viewBox',
      this.viewport.viewBox);
  }

  transformGlobalCoords(pos: Vector2): Vector2 {
    return new Vector2((pos.x - this.ctm.e) / this.ctm.a,
      (pos.y - this.ctm.f) / this.ctm.d);
  }

  setFocus(focus: boolean) {
    this.focusEvents$.next(focus);
  }

  createNode(descriptor: string) {
    const node = this.flowEditorService.createNode(descriptor, this.newNodePos);
    const id = this.graph.addNode(node);
    this.saveGraph.emit(this.graph.serialize());
    this.nodeViews.set(node, new NodeView(id, node));
    this.cd.detectChanges();
  }

  layoutTransform(layout: Layout): string {
    return `translate(${layout.left}, ${layout.top})`
  }

  startConnection(pinPos: Vector2, node: NodeView, direction: string, pin: PinView) {
    this.connectionHelper = new ConnectionHelper(this.mousePosition$, pinPos,
      [node, [direction, pin]]);
  }

  cancelConnection() {
    if (this.connectionHelper) {
      this.connectionHelper.stopConnecting();
      this.connectionHelper = null;
    }
  }

  hoverPin(n: NodeView, direction: string, pin: PinView) {
    if (this.connectionHelper && this.connectionHelper.from !== [n, [direction, pin]]) {
      this.connectionHelper.setConnectionTo(n, direction, pin);
    }
  }

  leavePin() {
    if (this.connectionHelper) {
      this.connectionHelper.clearConnectionTo();
    }
  }

  makeConnection() {
    if (this.connectionHelper.connectionAllowed) {
      if (this.connectionHelper.fromPath[0] === "inputs") {
        this.connectionHelper.toView.node.addConnection(
          this.connectionHelper.toPath[1].name,
          this.connectionHelper.fromView.node,
          this.connectionHelper.fromPath[1].name);
      } else {

      }
    }
    this.cancelConnection();
  }

  pinIconLocation(node: NodeView, body: Layout, pinSet: Layout,
                  pinGroup: Layout, pin: Layout) {
    return Vector2.ORIGIN.copy(node.node.position)
      .add(body.left, body.top)
      .add(pinSet.left, pinSet.top)
      .add(pinGroup.left, pinGroup.top)
      .add(pin.left, pin.top)
      .add(2, 2);
  }

  private deserializeFlowGraph(): FlowGraph {
    const graph = new FlowGraph();

    // Create the initial nodes.
    for(const inode of this.graphData.nodes) {
      const descriptor = this.flowEditorService.getDescriptor(inode.def);
      if (descriptor === null) {
        throw new Error(`Unable to load flow: No descriptor ${inode.def} found`);
      }
      graph.addNode(new FlowNode(Vector2.fromTuple(inode.position), descriptor));
    }

    // Iterate the connections
    for(const inode of this.graphData.nodes) {
      const node = graph.getNode(inode.id);

      for (const [id, c] of Object.entries(inode.connections)) {
        if (c.type === "connection") {
          const end = graph.getNode(c.value.node);
          node.addConnection(id, end, c.value.pin);
        } else {
          node.addConst(id, c.value);
        }
      }
    }

    // Create the variables
    for (const ivar of this.graphData.variables) {
      const type = this.flowEditorService.resolveType(ivar.type);
      if (type === null) {
        throw new Error(`Unable to create variable: Type '${ivar.type}' not found.`);
      }

      const variable = new Variable(Vector2.fromTuple(ivar.position),
        type, ivar.name, ivar.value);

      for (const conn of ivar.connections) {
        const node = graph.getNode(conn.value.node);
        variable.addConnection(node, conn.value.pin);
      }
    }

    // Set entrypoints
    graph.entrypoints = this.graphData.entrypoints;

    return graph;
  }
}
