import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  QueryList,
  SimpleChanges,
  ViewChildren
} from '@angular/core';
import { MatMenuTrigger } from '@angular/material';

import * as $ from 'jquery';
import * as _ from 'lodash';
import * as joint from 'jointjs';

import { DesignerService } from '../../designer/designer.service';
import { FlowNodeService } from '../flow-node/flow-node.service';
import { DesignerEntity, DesignerComponent, DesignerFlow } from '../../designer/designer';
import { GenericSelectDialog } from '../../dialogs/dialogs.component';

@Component({
  selector: 'flow-editor',
  templateUrl: './flow-editor.component.html',
  styleUrls: ['./flow-editor.component.css']
})
export class FlowEditorComponent implements OnChanges {
  @Input()
  flow: DesignerFlow;
  @Output()
  onNameChange = new EventEmitter<string>();
  @Output()
  onDestroyFlow = new EventEmitter<string>();

  graph: joint.dia.Graph;
  paper: joint.dia.Paper;

  private defaultCells: {};

  contextMenuPosition = { x: 0, y: 0 };
  newNodePosition = { x: 80, y: 80 };

  selected: any;

  scale = 1.0;

  scrolling = false;
  scrollX: number;
  scrollY: number;
  mX: number;
  mY: number;

  subscribed: Map<string, any> = new Map<string, any>(); // Id -> Functions

  constructor(
    private designerService: DesignerService,
    private flowNodeService: FlowNodeService,
    private elementRef: ElementRef
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    // Wrapping this in a timeout is an easy fix for ExpressionChangedAfterItHasBeenCheckedError
    // See https://blog.angularindepth.com/everything-you-need-to-know-about-the-expressionchangedafterithasbeenchecked
    //     error-error-e3fd9ce7dbb4
    setTimeout(() => {
      if (changes.flow === undefined) {
        return;
      }

      this.flowNodeService.update();

      if (this.flow === undefined) {
        this.graph.clear();
        this.paper.remove();
        const flowInner = this.elementRef.nativeElement.querySelector('.flow-inner');
        flowInner.insertAdjacentHTML('beforeend', '<div class="flow-paper"></div>');
        return;
      }

      this.graph = new joint.dia.Graph();
      this.paper = new joint.dia.Paper({
        el: $('.flow-paper'),
        model: this.graph,
        width: 10000,
        height: 10000,
        gridSize: 10,
        drawGrid: true,
        background: {
          color: '#fafafa'
        },
        defaultLink: new joint.dia.Link({
          attrs: {
            '.connection': { stroke: 'black', 'stroke-width': 3 },
            '.marker-target': { fill: 'black', d: 'M 10 0 L 0 5 L 10 10 z' }
          }
        }),
        // validateConnection: this.checkConnection,
        // validateMagnet: this.checkMagnet,
        snapLinks: { radius: 40 },
        linkPinning: false
      });

      if (this.flow.cells !== null) {
        this.loadFlow();
      }

      // Setup handlers

      // FIXME Probably not the most deterministic way to autosave,
      //       nor the most efficient
      this.graph.on('change', _.debounce(this.saveFlow.bind(this), 250, { leading: true, trailing: true }));

      this.paper.on('cell:pointerdown', cellView => {
        cellView.model.toFront();
      });

      this.paper.on('blank:contextmenu', this.showBlankContextMenu.bind(this));
      this.paper.on('cell:contextmenu', this.showNodeContextMenu.bind(this));

      // Disable normal scrolling
      // FIXME This does not work as expected
      // this.paper.on('blank:mousewheel', this.zoom.bind(this));
      // this.paper.on('cell:mousewheel', this.zoom.bind(this));

      this.paper.on('blank:pointerdown', this.enableScrolling.bind(this));
      window.addEventListener('mouseup', this.disableScrolling.bind(this));

      window.addEventListener('mousemove', this.updateMouse.bind(this));
    });
  }

  saveFlow() {
    const cells = [];
    for (const cell of this.graph.toJSON().cells) {
      if (cell.type == 'link') {
        // TODO Should we optimise links?
        cells.push(cell);
        continue;
      }

      const defaultCell = this.flowNodeService.defaults[cell.type];
      for (const i in cell) {
        if (_.isEqual(cell[i], defaultCell[i])) {
          delete cell[i];
        }
      }
      cells.push(cell);
    }
    this.flow.cells = cells;
  }

  loadFlow() {
    const cells = [];
    for (const i in this.flow.cells) {
      // restore default values
      const cell = this.flow.cells[i];
      const defaultCell = this.flowNodeService.defaults[cell.type];
      cells[i] = { ...defaultCell, ...cell };
    }
    this.graph.fromJSON({ cells: cells });
  }

  checkConnection(cellViewS, source, cellViewD, dest, end, linkView) {
    if (source == undefined || dest == undefined) {
      return false;
    }

    // Can't loop connections
    if (source.getAttribute('id') === dest.getAttribute('id')) {
      return false;
    }

    // In <-> Out connections only!
    if (source.getAttribute('port-group') === dest.getAttribute('port-group')) {
      console.log('Same group');
      return false;
    }

    return true;
  }

  checkMagnet(cellView, magnet) {
    return true;
  }

  addNode(cell) {
    this.graph.addCell(cell);
    cell.on('change', () => {
      if (cell.get('entity') !== null) {
        const attrs = this.flowNodeService.options.attributes[cell.get('entity')];
        const attrSelect = this.paper.$el.find('[model-id="' + cell.id + '"]').find('select[name="attr"]');
        if (attrs != attrSelect.html()) {
          attrSelect.html(attrs);
        }
      }
    });
    this.saveFlow();
  }

  addActionNode() {
    const cell = new joint.shapes['folly'].ActionNode({
      position: { ...this.newNodePosition }
    });
    this.addNode(cell);
  }

  addTriggerNode() {
    const cell = new joint.shapes['folly'].TriggerNode({
      position: { ...this.newNodePosition }
    });
    this.addNode(cell);
  }

  addConditionNode() {
    const cell = new joint.shapes['folly'].ConditionNode({
      position: { ...this.newNodePosition }
    });
    this.addNode(cell);
  }

  addOperationNode() {
    const cell = new joint.shapes['folly'].OperationNode({
      position: { ...this.newNodePosition }
    });
    this.addNode(cell);
  }

  addNestedFlowNode() {
    const cell = new joint.shapes['folly'].NestedFlowNode({
      position: { ...this.newNodePosition }
    });
    this.addNode(cell);
  }

  addInstanceNode() {
    const cell = new joint.shapes['folly'].InstanceNode({
      position: { ...this.newNodePosition }
    });
    this.addNode(cell);
  }

  addGateNode() {
    const cell = new joint.shapes['folly'].GateNode({
      position: { ...this.newNodePosition }
    });
    this.addNode(cell);
  }

  duplicateSelectedNode() {
    const cell = this.selected.clone();
    cell.translate(120, 90);
    this.addNode(cell);
  }

  deleteSelectedNode() {
    this.selected.remove();
    this.saveFlow();
  }

  updateMouse(evt: any) {
    this.mX = evt.clientX;
    this.mY = evt.clientY;

    if (this.scrolling) {
      const diffX = this.mX - this.scrollX;
      const diffY = this.mY - this.scrollY;
      this.scrollX = this.mX;
      this.scrollY = this.mY;

      const curX = $('.flow-inner').scrollLeft();
      const curY = $('.flow-inner').scrollTop();

      $('.flow-inner').scrollLeft(curX - diffX);
      $('.flow-inner').scrollTop(curY - diffY);
    }
  }

  @ViewChildren(MatMenuTrigger)
  contextMenus: QueryList<MatMenuTrigger>;

  showBlankContextMenu(event, x, y) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX;
    this.contextMenuPosition.y = event.clientY;
    this.newNodePosition.x = x;
    this.newNodePosition.y = y;
    this.contextMenus.first.openMenu();
  }

  showNodeContextMenu(cellView, event, x, y) {
    event.preventDefault();

    if (cellView.model.attributes.type == 'link') {
      return;
    }

    this.contextMenuPosition.x = event.clientX;
    this.contextMenuPosition.y = event.clientY;
    this.newNodePosition.x = x;
    this.newNodePosition.y = y;
    this.selected = cellView.model; // Model of the cellview is the actual cell
    this.contextMenus.last.openMenu();
  }

  zoom(evt, x, y, delta) {
    evt.preventDefault();

    // Apply scale delta
    if (delta < 0) {
      this.scale -= 0.1;
    } else {
      this.scale += 0.1;
    }

    // Clamp
    if (this.scale < 0.5) {
      this.scale = 0.5;
    }
    if (this.scale > 2.0) {
      this.scale = 2.0;
    }

    // Scale paper by scale
    this.paper.scale(this.scale, this.scale);
  }

  enableScrolling(evt: any) {
    this.scrolling = true;
    this.scrollX = this.mX;
    this.scrollY = this.mY;
  }

  disableScrolling(evt: any) {
    this.scrolling = false;
  }
}
