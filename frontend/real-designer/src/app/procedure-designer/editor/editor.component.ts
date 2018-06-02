import { Component, OnInit } from '@angular/core';
import { EntityFlowNode, IfLogicFlowNode, ConstLogicFlowNode, OperationLogicFlowNode, ActionLogicFlowNode, FlowNode, FlowEdge, Flow } from '../../flow/flow';
import { Operation, Conditionals, Action, PortType } from '../../flow/flow';
import { DesignerService } from '../../designer/designer.service';
import { DesignerEntity, DesignerComponent } from '../../designer/designer';

import { MatDialog, MatDialogRef } from '@angular/material';
import { GenericSelectDialog } from "../../dialogs/dialogs.component";

import { ScanEditorNode, EntityEditorNode, IfLogicEditorNode, EditorNode, ConstLogicEditorNode, OperationLogicEditorNode, ActionLogicEditorNode} from "./editor.parts";

declare var joint: any;
declare var $: any;

// TODO less monolithic

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
    paper: any;
    graph: any;

    selected: any;

    scale: number = 1.0;

    scrolling: boolean = false;
    scrollX: number;
    scrollY: number;
    mX: number;
    mY: number;

    nodes: Map<string, EditorNode> = new Map<string, EditorNode>();
    subscribed: Map<string, any> = new Map<string, any>(); // Id -> Functions

    // Current flow
    flow: Flow = new Flow();

    constructor(private designerService: DesignerService, public dialog: MatDialog) {
    }

    ngOnInit() {
        this.graph = new joint.dia.Graph;

        this.paper = new joint.dia.Paper({
            el: $('.editor'),
            model: this.graph,
            gridSize: 1,
            width: 10000,
            height: 10000,
            defaultLink: new joint.dia.Link({
                attrs: {
                    '.': { filter: { name: 'dropShadow', args: { dx: 1, dy: 1, blur: 3 } } },
                    '.connection' : { stroke: 'black', 'stroke-width': 3, },
                    '.marker-source': { fill: 'orange', d: 'M 10 0 L 0 5 L 10 10 z' },
                    '.marker-target': { fill: 'red', d: 'M 10 0 L 0 5 L 10 10 z' }
                },
                smooth: true,
            }),
            // validateConnection: this.checkConnection,
            // validateMagnet: this.checkMagnet,
            snapLinks: { radius: 40 },
            linkPinning: false,
        });


        this.addEntityToEditor(0);
        this.addEntityToEditor(1);
        this.addConstLogicNodeToEditor("10");
        this.addConstLogicNodeToEditor("30");
        this.addScanLogicNode();
        this.addIfLogicNodeToEditor();
        this.addOperationLogicNodeToEditor();
        this.addActionLogicNodeToEditor();
        this.addActionLogicNodeToEditor();

        // Setup handlers

        this.paper.on('blank:contextmenu', this.showBlankContextMenu.bind(this));
        this.paper.on('blank:pointerdown', this.hideBlankContextMenu.bind(this));
        this.paper.on('cell:pointerdown', this.hideBlankContextMenu.bind(this));

        this.paper.on('cell:contextmenu', this.showNodeContextMenu.bind(this));
        this.paper.on('blank:pointerdown', this.hideNodeContextMenu.bind(this));
        this.paper.on('cell:pointerdown', this.hideNodeContextMenu.bind(this));

        // Disable normal scrolling
        this.paper.on('blank:mousewheel', this.zoom.bind(this));
        //this.paper.on('cell:mousewheel', this.zoom.bind(this)); Brok :(
        this.paper.on('blank:pointerdown', this.enableScrolling.bind(this));

        this.paper.on('element:button:pointerdown', this.fireElementEvent.bind(this));
        window.addEventListener("mouseup", this.disableScrolling.bind(this));

        window.addEventListener("mousemove", this.updateMouse.bind(this));

        window.setInterval(this.process.bind(this), 10);
    }

    fireElementEvent(view, evt) {
        evt.stopPropagation();

        let target = this.subscribed.get(view.model.cid);

        if (target == undefined) {
            console.log("Unhandled event on " + view.model.cid);
        }
        else {
            target();
        }
    }

    checkConnection(cellViewS, source, cellViewD, dest, end, linkView) {

        if (source == undefined || dest == undefined) {
            return false;
        }

        // Can't loop connections
        if (source.getAttribute("id") === dest.getAttribute("id")) {
            return false;
        }

        // In <-> Out connections only!
        if (source.getAttribute("port-group") === dest.getAttribute("port-group")) {
            console.log("Same group")
            return false;
        }

        return true;
    }

    checkMagnet(cellView, magnet) {
        return true;
    }

    addEntityToEditorDialog() {
        let dialogRef = this.dialog.open(GenericSelectDialog, {
            width: '250px',
            data: {
                title: "Choose Entity",
                description: "Choose an Entity:",
                placeholder: "Entity",
                elements: Array.from(this.designerService.getEntities().values())
            }
        });

        dialogRef.afterClosed().subscribe(id => {
            if (id !== undefined) {
                this.addEntityToEditor(id)
            }
        });
        this.hideBlankContextMenu();
    }

    addEntityToEditor(id: number) {
        let fNode = new EntityFlowNode(id);
        let n = new EntityEditorNode(this.flow, fNode);
        let elements = n.buildElements(this.designerService);
        n.setupSubscriptions(this, elements);
        this.graph.addCells(elements);
    }

    addScanLogicNode() {
        let n = new ScanEditorNode(this.flow);
        let elements = n.buildElements(this.designerService);
        n.setupSubscriptions(this, elements);
        this.graph.addCells(elements);
    }

    addIfLogicNodeToEditor() {
        let fNode = new IfLogicFlowNode(Conditionals.Equal);
        let n = new IfLogicEditorNode(this.flow, fNode);
        let elements = n.buildElements(this.designerService);
        n.setupSubscriptions(this, elements);
        this.graph.addCells(elements);
    }

    addConstLogicNodeToEditor(value: string) {
        let fNode = new ConstLogicFlowNode(value);
        let n = new ConstLogicEditorNode(this.flow, value);
        let elements = n.buildElements(this.designerService);
        n.setupSubscriptions(this, elements);
        this.graph.addCells(elements);
    }

    addOperationLogicNodeToEditor() {
        let fNode = new OperationLogicFlowNode(Operation.Add);
        let n = new OperationLogicEditorNode(this.flow, fNode);
        let elements = n.buildElements(this.designerService);
        n.setupSubscriptions(this, elements);
        this.graph.addCells(elements);
    }

    addActionLogicNodeToEditor() {
        let fNode = new ActionLogicFlowNode(Action.Message);
        let n = new ActionLogicEditorNode(this.flow, fNode);
        let elements = n.buildElements(this.designerService);
        n.setupSubscriptions(this, elements);
        this.graph.addCells(elements);
    }

    addSubscription(id: string, func: any) {
        this.subscribed.set(id, func);
    }

    addComponentToEditorDialog() {
        this.hideBlankContextMenu();
    }

    addLogicNodeToEditorDialog() {
        class NodeType {
            id: string;
            constructor(name: string) {
                this.id = name;
            }

            getName(): string {
                return this.id;
            }
        }

        let dialogRef = this.dialog.open(GenericSelectDialog, {
            width: '250px',
            data: {
                title: "Choose Node",
                description: "Choose:",
                placeholder: "Logic Node",
                elements: [new NodeType("If Node"),
                 new NodeType("Constant Node"),
                 new NodeType("Operation Node"),
                 new NodeType("Action Node"),
                 new NodeType("Scan Node"),
                 ]
            }
        });

        dialogRef.afterClosed().subscribe(id => {
            if (id !== undefined) {
                if (id == "If Node") {
                    this.addIfLogicNodeToEditor();
                }
                else if (id == "Constant Node") {
                    this.addConstLogicNodeToEditor("0");
                }
                else if (id == "Operation Node") {
                    this.addOperationLogicNodeToEditor();
                }
                else if (id == "Action Node") {
                    this.addActionLogicNodeToEditor();
                }
                else if (id == "Scan Node") {
                    this.addScanLogicNode();
                }
            }
        });
        this.hideBlankContextMenu();
    }

    duplicateSelectedNode() {
        // TODO actually have internal data state (i.e. use FlowNode etc.) Then we actually do this properly
        this.hideNodeContextMenu();
    }

    deleteSelectedNode() {
        this.selected.remove();
        this.hideNodeContextMenu();
    }

    updateMouse(evt: any) {
        this.mX = evt.clientX;
        this.mY = evt.clientY;
    }

    // Process stuff on this editor (scrolling etc.)
    process() {
        // Scroll
        if (this.scrolling) {
            let diffX = this.mX - this.scrollX;
            let diffY = this.mY - this.scrollY;
            this.scrollX = this.mX;
            this.scrollY = this.mY;

            let curX = $("#editor-container").scrollLeft();
            let curY = $("#editor-container").scrollTop();

            $("#editor-container").scrollLeft(curX - diffX);
            $("#editor-container").scrollTop(curY - diffY);
        }
    }

    showBlankContextMenu(evt, x, y) {
        let cm = $("#blank-context-menu");
        cm.css({ top: this.mY, left: this.mX, });
        cm.show();
    }

    hideBlankContextMenu() {
        $("#blank-context-menu").hide()
    }

    showNodeContextMenu(cellView, evt, x, y) {
        this.selected = cellView.model; // Model of the cellview is the actual cell

        let cm = $("#node-context-menu");
        cm.css({ top: this.mY, left: this.mX, });
        cm.show();
    }

    hideNodeContextMenu() {
        $("#node-context-menu").hide()
    }

    zoom(evt, x, y, delta) {
        evt.preventDefault();

        // Apply scale delta
        if (delta < 0) {
            this.scale -= 0.1;
        }
        else {
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
