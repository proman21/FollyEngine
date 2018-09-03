import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

import { DesignerService } from '../../designer/designer.service';
import { DesignerEntity, DesignerComponent, DesignerFlow } from '../../designer/designer';
import { GenericSelectDialog } from "../../dialogs/dialogs.component";

// JointJS
declare var joint: any;
declare var V: any;
// jQuery
declare var $: any;
// lodash
declare var _: any;

@Component({
    selector: 'flow-editor',
    templateUrl: './flow-editor.component.html',
    styleUrls: ['./flow-editor.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class FlowEditorComponent implements OnInit {
    @Input() flow: DesignerFlow;

    paper: any;

    selected: any;

    scale: number = 1.0;

    scrolling: boolean = false;
    scrollX: number;
    scrollY: number;
    mX: number;
    mY: number;

    subscribed: Map<string, any> = new Map<string, any>(); // Id -> Functions

    constructor(private designerService: DesignerService, public dialog: MatDialog) {
    }

    ngOnInit() {
        this.paper = new joint.dia.Paper({
            el: $('.editor'),
            model: this.flow.getGraph(),
            width: 10000,
            height: 10000,
            gridSize: 10,
            drawGrid: true,
            background: {
                color: '#fafafa'
            },
            defaultLink: new joint.dia.Link({
                attrs: {
                    '.connection' : { stroke: 'black', 'stroke-width': 3, },
                    '.marker-target': { fill: 'black', d: 'M 10 0 L 0 5 L 10 10 z' }
                }
            }),
            // validateConnection: this.checkConnection,
            // validateMagnet: this.checkMagnet,
            snapLinks: { radius: 40 },
            linkPinning: false
        });

        joint.shapes.html = {};
        joint.shapes.html.Element = joint.shapes.basic.Generic.extend(_.extend({}, joint.shapes.basic.PortsModelInterface, {
            markup: [
                '<g class="rotatable">',
                '<g class="scalable">',
                '<rect/>',
                '<foreignObject width="240" height="200" transform="scale(42,50)">',
                '<div xmlns="http://www.w3.org/1999/xhtml" class="flow-node">',
                '<button class="delete">x</button>',
                '<span class="node-caption">Condition</span>', '<br/>',
                '<input name="name" type="text" value="Name" />', '<br/>',
                '<select name="entity"><option>Entity</option><option>one</option><option>two</option></select>', '<br/>',
                '<select name="attr"><option>Attribute</option><option>one</option><option>two</option></select>', '<br/>',
                '<select name="action"><option>Action</option><option>one</option><option>two</option></select>', '<br/>',
                '<input name="value" type="text" value="Value" />',
                '</div>',
                '</foreignObject>',
                '</g>',
                '<g class="inPorts"/>',
                '<g class="outPorts"/>',
                '</g>'
            ].join(''),
            portMarkup: '<g class="port<%= id %>"><circle/></g>',
            defaults: joint.util.deepSupplement({
                type: 'html.Element',
                inPorts: [],
                outPorts: [],
                attrs: {
                    '.': { magnet: false },
                    rect: {
                        stroke: 'none', 'fill-opacity': 0, width: '100%', height: '100%',
                    },
                    circle: {
                        r: 8,
                        magnet: true
                    },
                    '.inPorts circle': { fill: 'green', magnet: 'passive', type: 'input'},
                    '.outPorts circle': { fill: 'red', type: 'output'}
                }
            }, joint.shapes.basic.Generic.prototype.defaults),
            getPortAttrs: function (portName, index, total, selector, type) {
                var attrs = {};
                var portClass = 'port' + index;
                var portSelector = selector + '>.' + portClass;
                var portCircleSelector = portSelector + '>circle';
                attrs[portCircleSelector] = { port: { id: portName || _.uniqueId(type), type: type } };
                attrs[portSelector] = { ref: 'rect', 'ref-y': (index + 0.5) * (1 / total) };
                if (selector === '.outPorts') { attrs[portSelector]['ref-dx'] = 0; }
                return attrs;
            }
        }));


        joint.shapes.html.ElementView = joint.dia.ElementView.extend({
            initialize: function() {
                this.listenTo(this.model, 'process:ports', this.update);
                joint.dia.ElementView.prototype.initialize.apply(this, arguments);
            },
            render: function() {
                joint.dia.ElementView.prototype.render.apply(this, arguments);

                this.$box = this.paper.$el.find('[model-id="' + this.model.id + '"]');
                // Prevent paper from handling pointerdown.
                this.$box.find('input,select').on('mousedown click', function(evt) {
                    evt.stopPropagation();
                });
                // This is an example of reacting on the input change and storing the input data in the cell model.
                this.$box.find('input,select').on('change', _.bind(function(evt) {
                    var $target = $(evt.target);
                    this.model.set($target.attr('name'), $target.val());
                }, this));
                this.$box.find('.delete').on('click', _.bind(this.model.remove, this.model));

                return this;
            },
            renderPorts: function () {
                var $inPorts = this.$('.inPorts').empty();
                var $outPorts = this.$('.outPorts').empty();

                var portTemplate = _.template(this.model.portMarkup);

                _.each(_.filter(this.model.ports, function (p) { return p.type === 'in' }), function (port, index) {
                    $inPorts.append(V(portTemplate({ id: index, port: port })).node);
                });
                _.each(_.filter(this.model.ports, function (p) { return p.type === 'out' }), function (port, index) {
                    $outPorts.append(V(portTemplate({ id: index, port: port })).node);
                });
            }, 
            update: function () {
                // First render ports so that `attrs` can be applied to those newly created DOM elements
                // in `ElementView.prototype.update()`.
                this.renderPorts();
                joint.dia.ElementView.prototype.update.apply(this, arguments);
            }
        }); 

        if (this.flow.json != null) {
            this.flow.restore();
        } else {
            var el1 = new joint.shapes.html.Element({
                position: { x: 80, y: 80 },
                size: { width: 240, height: 200 },
                inPorts: ['in'],
                outPorts: ['true', 'false']
            });
            var el2 = new joint.shapes.html.Element({
                position: { x: 370, y: 160 },
                size: { width: 240, height: 200 },
                inPorts: ['in'],
                outPorts: ['true', 'false']
            });
            this.flow.getGraph().addCells([el1, el2]);
        }

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
                //this.addEntityToEditor(id)
            }
        });
        this.hideBlankContextMenu();
    }

    addEntityToEditor(id: number) {
    }

    addScanLogicNode() {
    }

    addIfLogicNodeToEditor() {
    }

    addConstLogicNodeToEditor(value: string) {
    }

    addOperationLogicNodeToEditor() {
    }

    addActionLogicNodeToEditor() {
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
            /*if (id !== undefined) {
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
            }*/
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
