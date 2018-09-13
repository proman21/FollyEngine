import { Component, EventEmitter, Input, OnChanges, Output, QueryList, ViewChildren, ViewEncapsulation } from '@angular/core';
import { MatMenuTrigger } from '@angular/material';

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
export class FlowEditorComponent implements OnChanges {
    @Input() flow: DesignerFlow;
    @Output() onNameChange = new EventEmitter<string>();
    @Output() onDestroyFlow = new EventEmitter<string>();

    graph: any;
    paper: any;

    private defaultCells: {};

    contextMenuPosition = { x: 0, y: 0 };
    newNodePosition = { x: 80, y: 80 };

    selected: any;

    scale: number = 1.0;

    scrolling: boolean = false;
    scrollX: number;
    scrollY: number;
    mX: number;
    mY: number;

    subscribed: Map<string, any> = new Map<string, any>(); // Id -> Functions

    constructor(private designerService: DesignerService) {
    }

    ngOnChanges() {
        let entities = this.designerService.getEntities();
        let entityEntries = Array.from(entities).reduce((o, [key, value]) => {
            o[key] = value.name;
            return o;
        }, []);
        let components = this.designerService.getComponents();
        let attributes = {};
        entities.forEach((e) => {
            attributes[e.name] = [];
            e.components.forEach((c) => {
                components.get(c).attributes.forEach(function(attr) {
                    attributes[e.name].push(attr.getName());
                });
            });
        });
        let flows = Array.from(this.designerService.getFlows()).reduce((o, [key, value]) => {
            if (key !== this.flow.id) {
                o[key] = value.name;
            }
            return o;
        }, []);
        let assets = Array.from(this.designerService.getAssets()).reduce((o, [key, value]) => {
            o[key] = value.name;
            return o;
        }, []);

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
                    '.connection' : { stroke: 'black', 'stroke-width': 3, },
                    '.marker-target': { fill: 'black', d: 'M 10 0 L 0 5 L 10 10 z' }
                }
            }),
            // validateConnection: this.checkConnection,
            // validateMagnet: this.checkMagnet,
            snapLinks: { radius: 40 },
            linkPinning: false
        });

        joint.shapes.basic.PortsModel = joint.shapes.basic.Generic.extend(joint.shapes.basic.PortsModelInterface);

        joint.shapes.folly = {};
        joint.shapes.folly.Node = class Node extends joint.shapes.basic.PortsModel {
            get markup() {
                return `<g class="rotatable">
                            <g class="scalable">
                                <rect/>
                                <foreignObject>
                                    <div xmlns="http://www.w3.org/1999/xhtml" class="flow-node">
                                        ${this.template}
                                    </div>
                                </foreignObject>
                            </g>
                            <g class="inPorts"/>
                            <g class="outPorts"/>
                        </g>`;
            }

            get template() {
                return 'hello, world';
            }

            defaults() {
                return {
                    ...super.defaults,
                    type: 'folly.' + this.constructor.name,
                    size: { width: 240, height: 180 },
                    inPorts: ['In'],
                    outPorts: ['Out'],
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
                };
            }

            getPortAttrs(portName, index, total, selector, type) {
                var attrs = {};
                var portClass = 'port' + index;
                var portSelector = selector + '>.' + portClass;
                var portCircleSelector = portSelector + '>circle';
                attrs[portCircleSelector] = { port: { id: portName, type: type } };
                attrs[portSelector] = { ref: 'rect', 'ref-y': (index + 0.5) * (1 / total) };
                if (selector === '.outPorts') { attrs[portSelector]['ref-dx'] = 0; }
                return attrs;
            }
        };

        joint.shapes.folly.NodeView = class extends joint.dia.ElementView {
            constructor() {
                super(...arguments);
                this.listenTo(this.model, 'process:ports', this.update);
            }

            render() {
                super.render(...arguments);

                this.$box = this.paper.$el.find('[model-id="' + this.model.id + '"]');
                
                // Prevent paper from handling pointerdown.
                this.$box.find('input,select').on('mousedown click', function(evt) {
                    evt.stopPropagation();
                });
                
                // React on the input change and store the input data in the cell model.
                this.$box.find('input,select').on('change', function(evt) {
                    var $target = $(evt.target);
                    this.model.set($target.attr('name'), $target.val());
                }.bind(this));
                this.$box.find('input,select').each(function(index, element) {
                    var $element = $(element);
                    var val = this.model.get($element.attr('name'));
                    if (val != undefined) {
                        $element.val(val);
                    }
                }.bind(this));
                
                // Update the box whenever the underlying model changes.
                this.model.on('change', this.updateBox, this);
                this.updateBox();

                return this;
            }

            renderPorts() {
                let inPorts = Object.values(this.model.ports).filter(p => p['type'] === 'in');
                let $inPorts = this.$('.inPorts').empty();
                inPorts.forEach(function (port, index) {
                    $inPorts.append(V(`<g class="port${index}"><circle/></g>`).node);
                });

                let outPorts = Object.values(this.model.ports).filter(p => p['type'] === 'out');
                let $outPorts = this.$('.outPorts').empty();
                outPorts.forEach(function (port, index) {
                    $outPorts.append(V(`<g class="port${index}"><circle/></g>`).node);
                });
            }

            update() {
                // First render ports so that `attrs` can be applied to those newly created DOM elements
                // in `ElementView.prototype.update()`.
                this.renderPorts();
                super.update(...arguments);
            }

            updateBox() {
                let $scalable = this.$box.find('.scalable');
                let bbox = this.model.getBBox();

                const matrixRegex = /matrix\((-?\d*\.?\d+),\s*0,\s*0,\s*(-?\d*\.?\d+),\s*0,\s*0\)/;
                let scale = $scalable.css('transform').match(matrixRegex);

                if (scale == null) {
                    return;
                }

                $scalable.find('foreignObject').css({
                    width: bbox.width,
                    height: bbox.height,
                    transform: 'scale(' + (1 / scale[1]) + ',' + (1 / scale[2]) + ')'
                });

                if (this.model.get('entity')) {
                    this.$box.find('select[name="attr"]')
                        .html(`<option>${attributes[this.model.get('entity')].join('</option><option>')}</option>`);
                }
            }
        };

        joint.shapes.folly.ConditionNode = class ConditionNode extends joint.shapes.folly.Node {
            get template() {
                const attrs = attributes[Object.keys(attributes)[0]];
                const actions = [
                    'Equal to',
                    'Greater than',
                    'Less than',
                    'Greater than or equal to',
                    'Less than or equal to'
                ];
                return `<span class="node-caption">Condition</span>
                        <div class="input-group">
                            <input name="name" type="text" value="New Condition"/>
                        </div>
                        <div class="input-group">
                            <label>Entity</label>
                            <select name="entity"><option>${entityEntries.join('</option><option>')}</option></select>
                            <label>Attribute</label>
                            <select name="attr"><option>${attrs.join('</option><option>')}</option></select>
                        </div>
                        <div class="input-group">
                            <label>is</label>
                            <select name="action"><option>${actions.join('</option><option>')}</option></select>
                        </div>
                        <div class="input-group">
                            <label>Value</label>
                            <input name="value" type="text" value=""/>
                        </div>`;
            }

            get defaults() {
                return {
                    ...super.defaults(),
                    outPorts: ['True', 'False']
                };
            }
        };
        joint.shapes.folly.ConditionNodeView = class extends joint.shapes.folly.NodeView {};

        joint.shapes.folly.OperationNode = class OperationNode extends joint.shapes.folly.Node {
            get template() {
                const attrs = attributes[Object.keys(attributes)[0]];
                const actions = [
                    'Add',
                    'Subtract',
                    'Set'
                ];
                return `<span class="node-caption">Operation</span>
                        <div class="input-group">
                            <input name="name" type="text" value="New Operation"/>
                        </div>
                        <div class="input-group">
                            <label>Entity</label>
                            <select name="entity"><option>${entityEntries.join('</option><option>')}</option></select>
                            <label>Attribute</label>
                            <select name="attr"><option>${attrs.join('</option><option>')}</option></select>
                        </div>
                        <div class="input-group">
                            <label>Action</label>
                            <select name="action"><option>${actions.join('</option><option>')}</option></select>
                        </div>
                        <div class="input-group">
                            <label>Value</label>
                            <input name="value" type="text" value=""/>
                        </div>`;
            }
        };
        joint.shapes.folly.OperationNodeView = class extends joint.shapes.folly.NodeView {};

        joint.shapes.folly.ActionNode = class ActionNode extends joint.shapes.folly.Node {
            get template() {
                const attrs = attributes[Object.keys(attributes)[0]];
                const actions = [
                    'OSC',
                    'DMX'
                ];
                return `<span class="node-caption">Action</span>
                        <div class="input-group">
                            <input name="name" type="text" value="New Action"/>
                        </div>
                        <div class="input-group">
                            <label>Entity</label>
                            <select name="entity"><option>${entityEntries.join('</option><option>')}</option></select>
                            <label>Attribute</label>
                            <select name="attr"><option>${attrs.join('</option><option>')}</option></select>
                        </div>
                        <div class="input-group">
                            <label>Action</label>
                            <select name="action"><option>${actions.join('</option><option>')}</option></select>
                        </div>
                        <div class="input-group">
                            <label>File</label>
                            <select name="action"><option>${assets.join('</option><option>')}</option></select>
                        </div>`;
            }
        };
        joint.shapes.folly.ActionNodeView = class extends joint.shapes.folly.NodeView {};

        joint.shapes.folly.TriggerNode = class TriggerNode extends joint.shapes.folly.Node {
            get template() {
                const trigger = [
                    'RFID',
                    'Time'
                ];
                return `<span class="node-caption">Trigger</span>
                        <div class="input-group">
                            <input name="name" type="text" value="New Trigger"/>
                        </div>
                        <div class="input-group">
                            <label>Type</label>
                            <select name="trigger"><option>${trigger.join('</option><option>')}</option></select>
                        </div>
                        <div class="input-group">
                            <label>Entity</label>
                            <select name="entity"><option>${entityEntries.join('</option><option>')}</option></select>
                        </div>`;
            }

            get defaults() {
                return {
                    ...super.defaults(),
                    size: { width: 220, height: 140 }
                };
            }
        };
        joint.shapes.folly.TriggerNodeView = class extends joint.shapes.folly.NodeView {};

        joint.shapes.folly.NestedFlowNode = class NestedFlowNode extends joint.shapes.folly.Node {
            get template() {
                return `<div class="input-group">
                            <label>Flow</label>
                            <select name="flow"><option>${flows.join('</option><option>')}</option></select>
                        </div>`;
            }

            get defaults() {
                return {
                    ...super.defaults(),
                    size: { width: 220, height: 60 }
                };
            }
        };
        joint.shapes.folly.NestedFlowNodeView = class extends joint.shapes.folly.NodeView {};
        
        // JointJS serialises more than we probably need it to
        // so we have to work out what we don't need
        let graph = new joint.dia.Graph;
        // for each object in the folly namespace
        for (let name of Object.getOwnPropertyNames(joint.shapes.folly)) {
            if (name.endsWith('View')) {
                // we're only interested in the elements,
                // not the views
                continue;
            }
            // instantiate node
            let node = new joint.shapes.folly[name]();
            // add to temporary graph
            graph.addCell(node);
        }
        this.defaultCells = graph.toJSON().cells.reduce((result, current) => {
            result[current.type] = current;
            // remove entries that may cause collisions
            delete result[current.type].id;
            delete result[current.type].position;
            delete result[current.type].z;
            delete result[current.type].type;
            return result;
        }, {});

        if (this.flow.cells == null) {
            this.newFlow();
        } else {
            this.loadFlow();
        }

        
        // Setup handlers

        // FIXME Probably not the most deterministic way to autosave,
        //       nor the most efficient
        this.graph.on('change', _.debounce(function() {
            this.saveFlow();
        }.bind(this), 250, {leading: true, trailing: true}));

        // https://github.com/clientIO/joint/issues/879#issuecomment-388695519
        this.paper.options.guard = function(evt) {
            return (evt.type === 'mousedown' && evt.buttons === 2);
        };

        this.paper.on('cell:pointerdown', (cellView) => {
            cellView.model.toFront();
        });

        this.paper.on('blank:contextmenu', this.showBlankContextMenu.bind(this));
        this.paper.on('cell:contextmenu', this.showNodeContextMenu.bind(this));

        // Disable normal scrolling
        this.paper.on('blank:mousewheel', this.zoom.bind(this));
        //this.paper.on('cell:mousewheel', this.zoom.bind(this)); Brok :(
        
        this.paper.on('blank:pointerdown', this.enableScrolling.bind(this));
        window.addEventListener("mouseup", this.disableScrolling.bind(this));
        
        window.addEventListener("mousemove", this.updateMouse.bind(this));
    }

    newFlow() {
        /*this.addActionNode();
        this.addTriggerNode();
        this.addConditionNode();
        this.addOperationNode();
        this.addNestedFlowNode();*/
        this.saveFlow();
    }

    saveFlow() {
        let cells = [];
        for (let cell of this.graph.toJSON().cells) {
            if (cell.type == 'link') {
                // TODO Should we optimise links?
                cells.push(cell);
                continue;
            }

            let defaultCell = this.defaultCells[cell.type];
            for (let i in cell) {
                if (_.isEqual(cell[i], defaultCell[i])) {
                    delete cell[i];
                }
            }
            cells.push(cell);
        }
        this.flow.cells = cells;
    }

    loadFlow() {
        let cells = [];
        for (let i in this.flow.cells) {
            // restore default values
            let cell = this.flow.cells[i];
            let defaultCell = this.defaultCells[cell.type];
            cells[i] = {...defaultCell, ...cell};
        }
        this.graph.fromJSON({cells: cells});
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

    addActionNode() {
        const cell = new joint.shapes.folly.ActionNode({
            position: {...this.newNodePosition}
        });
        this.graph.addCell(cell);
    }

    addTriggerNode() {
        const cell = new joint.shapes.folly.TriggerNode({
            position: {...this.newNodePosition}
        });
        this.graph.addCell(cell);
    }

    addConditionNode() {
        const cell = new joint.shapes.folly.ConditionNode({
            position: {...this.newNodePosition}
        });
        this.graph.addCell(cell);
    }

    addOperationNode() {
        const cell = new joint.shapes.folly.OperationNode({
            position: {...this.newNodePosition}
        });
        this.graph.addCell(cell);
    }

    addNestedFlowNode() {
        const cell = new joint.shapes.folly.NestedFlowNode({
            position: {...this.newNodePosition}
        });
        this.graph.addCell(cell);
    }

    duplicateSelectedNode() {
        let cell = this.selected.clone();
        cell.translate(120, 90);
        this.graph.addCell(cell);
    }

    deleteSelectedNode() {
        this.selected.remove();
    }

    updateMouse(evt: any) {
        this.mX = evt.clientX;
        this.mY = evt.clientY;
        
        if (this.scrolling) {
            let diffX = this.mX - this.scrollX;
            let diffY = this.mY - this.scrollY;
            this.scrollX = this.mX;
            this.scrollY = this.mY;

            let curX = $(".flow-inner").scrollLeft();
            let curY = $(".flow-inner").scrollTop();

            $(".flow-inner").scrollLeft(curX - diffX);
            $(".flow-inner").scrollTop(curY - diffY);
        }
    }

    @ViewChildren(MatMenuTrigger) contextMenus: QueryList<MatMenuTrigger>;

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
