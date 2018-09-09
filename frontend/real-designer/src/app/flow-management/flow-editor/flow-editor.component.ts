import { Component, Input, OnChanges, ViewEncapsulation } from '@angular/core';
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
export class FlowEditorComponent implements OnChanges {
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

    ngOnChanges() {
        let entities = this.designerService.getEntities();
        let entityEntries = Array.from(entities)
            .reduce((o, [key, value]) => {
                o[key] = value.name;
                return o;
            }, []);
        let components = this.designerService.getComponents();
        let attributes = {};
        entities.forEach(function(entity) {
            attributes[entity.name] = [];
            entity.components.forEach(function(c) {
                components.get(c).attributes.forEach(function(attr) {
                    attributes[entity.name].push(attr.getName());
                });
            });
        });

        this.flow.graph = new joint.dia.Graph;

        this.paper = new joint.dia.Paper({
            el: $('.flow-paper'),
            model: this.flow.graph,
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

        joint.shapes.folly = {};
        joint.shapes.folly.Node = class extends joint.shapes.basic.Generic.extend(joint.shapes.basic.PortsModelInterface) {
            markup = [
                '<g class="rotatable">',
                '<g class="scalable">',
                '<rect/>',
                '<foreignObject>',
                '<div xmlns="http://www.w3.org/1999/xhtml" class="flow-node">',
                '<button class="delete">x</button>',
                '<span class="node-caption"></span>', '<br/>',
                '<input name="name" type="text" value="New Node" />', '<br/>',
                '<label>Entity</label>', '<br/>',
                '<select name="entity"></select>', '<br/>',
                '<label>Attribute</label>', '<br/>',
                '<select name="attr"><option></option></select>', '<br/>',
                '<label>Action</label>', '<br/>',
                '<select name="action"></select>', '<br/>',
                '<label>Value</label>', '<br/>',
                '<input name="value" type="text" value="" />',
                '</div>',
                '</foreignObject>',
                '</g>',
                '<g class="inPorts"/>',
                '<g class="outPorts"/>',
                '</g>'
            ].join('');
            portMarkup = '<g class="port<%= id %>"><circle/></g>';

            defaults() {
                return {
                    ...super.defaults,
                    type: 'folly.Node',
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
                attrs[portCircleSelector] = { port: { id: portName || _.uniqueId(type), type: type } };
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
                this.$box.find('.node-caption').html(this.model.get('label'));
                this.$box.find('input,select').on('change', _.bind(function(evt) {
                    var $target = $(evt.target);
                    this.model.set($target.attr('name'), $target.val());

                    if ($target.attr('name') == 'entity') {
                        this.$box.find('select[name="attr"]').append('<option>' + attributes[this.model.get('entity')].join('</option><option>') + '</option>');
                    }
                }, this));
                this.$box.find('input,select').each(_.bind(function(index, element) {
                    var $element = $(element);
                    var val = this.model.get($element.attr('name'));
                    if (val != undefined) {
                        $element.val(val);
                    }
                }, this));
                this.$box.find('select[name="entity"]').append('<option>' + entityEntries.join('</option><option>') + '</option>');
                this.$box.find('select[name="action"]').append('<option>' + this.model.get('actions').join('</option><option>') + '</option>');
                this.$box.find('.delete').on('click', _.bind(this.model.remove, this.model));
                
                // Update the box whenever the underlying model changes.
                this.model.on('change', this.updateBox, this);
                this.updateBox();

                return this;
            }

            renderPorts() {
                var $inPorts = this.$('.inPorts').empty();
                var $outPorts = this.$('.outPorts').empty();

                var portTemplate = _.template(this.model.portMarkup);

                _.each(_.filter(this.model.ports, function (p) { return p.type === 'in' }), function (port, index) {
                    $inPorts.append(V(portTemplate({ id: index, port: port })).node);
                });
                _.each(_.filter(this.model.ports, function (p) { return p.type === 'out' }), function (port, index) {
                    $outPorts.append(V(portTemplate({ id: index, port: port })).node);
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
            }
        };

        joint.shapes.folly.ConditionNode = class extends joint.shapes.folly.Node {
            defaults() {
                let superDefaults = super.defaults();
                return {
                    ...superDefaults,
                    type: 'folly.ConditionNode',
                    label: 'Condition',
                    actions: ['Equal to', 'Greater than', 'Less than', 'Greater than or equal to', 'Less than or equal to'],
                    inPorts: ['in'],
                    outPorts: ['True', 'False']
                };
            }
        };
        joint.shapes.folly.ConditionNodeView = class extends joint.shapes.folly.NodeView {};

        joint.shapes.folly.OperationNode = class extends joint.shapes.folly.Node {
            defaults() {
                let superDefaults = super.defaults();
                return {
                    ...superDefaults,
                    type: 'folly.OperationNode',
                    label: 'Operation',
                    actions: ['Add', 'Subtract', 'Set']
                };
            }
        };
        joint.shapes.folly.OperationNodeView = class extends joint.shapes.folly.NodeView {};

        joint.shapes.folly.ActionNode = class extends joint.shapes.folly.Node {
            defaults() {
                let superDefaults = super.defaults();
                return {
                    ...superDefaults,
                    type: 'folly.ActionNode',
                    label: 'Action',
                    actions: ['???']
                };
            }
        };
        joint.shapes.folly.ActionNodeView = class extends joint.shapes.folly.NodeView {};

        if (this.flow.json != null) {
            this.flow.restore();
        } else {
            this.addIfLogicNodeToEditor();
            this.addOperationLogicNodeToEditor();
            this.addActionLogicNodeToEditor();
            this.flow.save();
        }

        // Setup handlers

        this.flow.graph.on('change', _.debounce(_.bind(function() {
            this.flow.save();
            console.log(this.flow.json);
        }, this), 100, {leading: true, trailing: true}));

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
        var el = new joint.shapes.folly.ConditionNode({
            position: { x: 80, y: 80 },
            size: { width: 240, height: 200 }
        });
        this.flow.graph.addCells([el]);
    }

    addConstLogicNodeToEditor(value: string) {
    }

    addOperationLogicNodeToEditor() {
        var el = new joint.shapes.folly.OperationNode({
            position: { x: 80, y: 80 },
            size: { width: 240, height: 200 }
        });
        this.flow.graph.addCells([el]);
    }

    addActionLogicNodeToEditor() {
        var el = new joint.shapes.folly.ActionNode({
            position: { x: 80, y: 80 },
            size: { width: 200, height: 240 }
        });
        this.flow.graph.addCells([el]);
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
