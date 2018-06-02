import { EntityFlowNode, IfLogicFlowNode, ConstLogicFlowNode, OperationLogicFlowNode, ActionLogicFlowNode, FlowNode, FlowEdge, Flow } from '../../flow/flow';
import { Operation, Conditionals, Action, PortType } from '../../flow/flow';
import { DesignerService } from '../../designer/designer.service';
import { DesignerEntity, DesignerComponent } from '../../designer/designer';
import { MatDialog, MatDialogRef } from '@angular/material';
import { GenericSelectDialog } from "../../dialogs/dialogs.component";

declare var joint: any;
declare var $: any;

export abstract class EditorNode {
    flow: Flow;

    constructor(flow: Flow) {
        this.flow = flow;
    }

    abstract buildElements(designerService: DesignerService);
    abstract addPortElement(id: string, pType: PortType);

    setupSubscriptions(parent, elements) {};
}


export class ScanEditorNode extends EditorNode {
    constructor(flow: Flow) {
        super(flow);
    }

    addPortElement(id: string, pType: PortType) {
    }

    buildElements(designerService: DesignerService) {
        let node = buildBasicFlowNode("Scan", 0, true);
        node.attr({rect:{style:{'fill':'#AAAAAA'}}});
        let inPort = buildPort(null, PortType.Trigger);
        let outPort = buildPort(null, PortType.Execute);
        node.addPort(inPort);
        node.addPort(outPort);
        return [node];
    }

}


export class IfLogicEditorNode extends EditorNode {
    title: any;
    body: any;

    constructor(flow: Flow, private node: IfLogicFlowNode) {
        super(flow);
    }

    setupSubscriptions(parent, elements) {
        parent.addSubscription(elements[1].cid, this.toggleEvent.bind(this));
    }

    toggleEvent() {
        if (this.getConditional() == Conditionals.LessEq) {
            this.setConditional(Conditionals.Equal);
        }
        else {
            this.setConditional(this.getConditional() + 1);
        }
        this.body.attr({
            label: {
                text: Conditionals[this.getConditional()],
            }
        });
    }

    getConditional(): Conditionals {
        return this.node.getConditional();
    }

    setConditional(cond: Conditionals) {
        this.node.setConditional(cond);
    }

    addPortElement(id: string, pType: PortType) {
        // let portNode = buildPort(id, pType);
    }

    buildTitle(title: string) {
        let node = buildBasicFlowNode(title, 0, true);
        node.attr({rect:{style:{'fill':'#AAAAAA'}}});
        let runPort = buildPort(null, PortType.Execute);
        node.addPort(runPort);
        return node;
    }

    buildBody() {
        let node = buildBasicFlowNode(Conditionals[this.getConditional()], 1, false, true, 100);

        let inPortOne = buildPort(null, PortType.Input);
        let inPortTwo = buildPort(null, PortType.Input);
        let truePort = buildPort(null, PortType.Trigger, "True");
        let falsePort = buildPort(null, PortType.Trigger, "False");

        node.addPort(inPortOne);
        node.addPort(inPortTwo);
        node.addPort(truePort);
        node.addPort(falsePort);

        return node;
    }

    buildElements(designerService: DesignerService) {
        let title = this.buildTitle("If Condition");
        let ele = this.buildBody();
        title.embed(ele);

        this.title = title;
        this.body = ele;

        return [title, ele];
    }
}

export class ActionLogicEditorNode extends EditorNode {
    title: any;
    body: any;

    constructor(flow: Flow, private node: ActionLogicFlowNode) {
        super(flow);
    }

    setupSubscriptions(parent, elements) {
        parent.addSubscription(elements[1].cid, this.toggleEvent.bind(this));
    }

    toggleEvent() {
        if (this.getAction() == Action.Other) {
            this.setAction(Action.Message);
        }
        else {
            this.setAction(this.getAction() + 1);
        }
        this.body.attr({
            label: {
                text: Action[this.getAction()],
            }
        });
    }

    getAction(): Action {
        return this.node.getAction();
    }

    setAction(act: Action) {
        this.node.setAction(act);
    }

    addPortElement(id: string, pType: PortType) {
        // let portNode = buildPort(id, pType);
    }

    buildTitle(title: string) {
        let node = buildBasicFlowNode(title, 0, true);
        node.attr({rect:{style:{'fill':'#AAAAAA'}}});
        let runPort = buildPort(null, PortType.Execute);
        node.addPort(runPort);
        return node;
    }

    buildBody() {
        let node = buildBasicFlowNode(Action[this.getAction()], 1, false, true);

        return node;
    }

    buildElements(designerService: DesignerService) {
        let title = this.buildTitle("Action");
        let ele = this.buildBody();
        title.embed(ele);

        this.title = title;
        this.body = ele;

        return [title, ele];
    }
}

export class ConstLogicEditorNode extends EditorNode {
    value: string;

    title: any;
    body: any;

    constructor(flow: Flow, val: string) {
        super(flow);
        this.value = val;
    }

    setupSubscriptions(parent, elements) {
        parent.addSubscription(elements[1].cid, this.toggleEvent.bind(this));
    }

    toggleEvent() {

        // Ayy need entry dialo

        this.body.attr({
            label: {
                text: this.value
            }
        });
    }

    addPortElement(id: string, pType: PortType) {
        // let portNode = buildPort(id, pType);
    }

    buildTitle(title: string) {
        let node = buildBasicFlowNode(title, 0, true);
        node.attr({rect:{style:{'fill':'#AAAAAA'}}});
        return node;
    }

    buildBody() {
        let node = buildBasicFlowNode(this.value, 1, false, true);
        let outPort = buildPort(null, PortType.Output);
        node.addPort(outPort);

        return node;
    }

    buildElements(designerService: DesignerService) {
        let title = this.buildTitle("Constant");
        let ele = this.buildBody();
        title.embed(ele);

        this.title = title;
        this.body = ele;

        return [title, ele];
    }
}

export class OperationLogicEditorNode extends EditorNode {
    title: any;
    body: any;

    constructor(flow: Flow, private node: OperationLogicFlowNode) {
        super(flow);
    }

    setupSubscriptions(parent, elements) {
        parent.addSubscription(elements[1].cid, this.toggleEvent.bind(this));
    }

    toggleEvent() {
        if (this.getOperation() == Operation.Negate) {
            this.setOperation(Operation.Add);
        }
        else {
            this.setOperation(this.getOperation() + 1);
        }
        this.body.attr({
            label: {
                text: Operation[this.getOperation()],
            }
        });
    }

    getOperation(): Operation {
        return this.node.getOperation();
    }

    setOperation(op: Operation) {
        this.node.setOperation(op);
    }

    addPortElement(id: string, pType: PortType) {
        // let portNode = buildPort(id, pType);
    }

    buildTitle(title: string) {
        let node = buildBasicFlowNode(title, 0, true);
        node.attr({rect:{style:{'fill':'#AAAAAA'}}});

        let runPort = buildPort(null, PortType.Execute);
        node.addPort(runPort);

        return node;
    }

    buildBody() {
        let node = buildBasicFlowNode(Operation[this.getOperation()], 1, false, true, 100);

        let inPortOne = buildPort(null, PortType.Input);
        let inPortTwo = buildPort(null, PortType.Input);
        let outPort = buildPort(null, PortType.Output);

        node.addPort(inPortOne);
        node.addPort(inPortTwo);
        node.addPort(outPort);

        return node;
    }

    buildElements(designerService: DesignerService) {
        let title = this.buildTitle("Operation");
        let ele = this.buildBody();
        title.embed(ele);

        this.title = title;
        this.body = ele;

        return [title, ele];
    }
}

export class EntityEditorNode extends EditorNode {

    constructor(flow: Flow, private node: EntityFlowNode) {
        super(flow);
    }

    addPortElement(id: string, pType: PortType) {
        // let portNode = buildPort(id, pType);
    }

    buildTitle(ent: DesignerEntity) {
        let node = buildBasicFlowNode(ent.getName(), 0, true, false);
        node.attr({rect:{style:{'fill':'#AAAAAA'}}});

        return node;
    }

    buildComponent(comp: DesignerComponent, offset: number) {
        let node = buildBasicFlowNode(comp.getName(), offset, false, false);
        node.attr({rect:{style:{'fill':'#C4C4C4'}}});

        if (comp.getName() == "RFID") {
            let trigPort = buildPort(String(comp.id), PortType.Trigger);
            node.addPort(trigPort);
        }

        return node;
    }

    buildAttributes(comp: DesignerComponent, offset: number)  {
        let attributes = [];
        let currentOffset = offset;
        for (let j = 0; j < comp.attributes.length; j++) {
            let attr = comp.attributes[j];
            let attrNode = buildBasicFlowNode(attr.getName(), currentOffset++, false, false);

            let outPort = buildPort(comp.id + "-" + attr.getName(), PortType.Output);
            let inPort = buildPort(comp.id + "-" + attr.getName(), PortType.Input);

            attrNode.addPort(inPort);
            attrNode.addPort(outPort);

            attributes.push(attrNode);
        }

        return attributes;
    }

    buildElements(designerService: DesignerService) {
        let comps = designerService.getComponents();
        let ent = this.node.getEnt(designerService);

        let title = this.buildTitle(ent);

        let ele = [title];
        let currentOffset = 1;

        for (let i = 0; i < ent.components.length; i++) {
            let comp = comps.get(ent.components[i]);

            let component = this.buildComponent(comp, currentOffset++);
            let attributes = this.buildAttributes(comp, currentOffset);

            title.embed(component);
            ele.push(component);
            attributes.forEach(e => title.embed(e));
            attributes.forEach(e => ele.push(e));

            currentOffset += attributes.length;
        }

        return ele;
    }

}

// Reason to change the width?
function buildBasicFlowNode(name: string, offset: number, interactive: boolean, event?: boolean, height?: number) {
    if (height == undefined) {
        height = 50;
    }

    if (event == undefined) {
        event = false;
    }
    var element = new FlowNodeShape();
    element.position(100, 30 + (50 * (offset + 1)));
    element.resize(200, height);
    element.attr({
        label: {
            pointerEvents: 'none',
            visibility: 'visible',
            text: name,
        },
        body: {
            cursor: 'default',
            visibility: 'visible'
        },
        button: {
            event: 'element:button:pointerdown',
            fill: '#97C7F0',
            stroke: 'black',
            strokeWidth: 2
        },
    });

    if (!event) {
        element.attr({
            button: {
                event: 'none',
                width: '0',
                height: '0',
            }
        });
    }

    if (!interactive) {
        element.attr({body: {
            pointerEvents: 'none'
        }});
    }
    return element;
}

function buildPort(name: string, type: PortType, label?: string) {
    let port;
    if (label != undefined) {
        port = {
            args: { },
            attrs: {
                circle: { r: 9, magnet: true, stroke: 'black', 'stroke-width': 1 },
                text: { text: label, pointerEvents: 'none' },
            },
        };
    }
    else {
        port = {
            args: { },
            attrs: {
                circle: { r: 9, magnet: true, stroke: 'black', 'stroke-width': 1 },
            },
        };
    }

	switch (type) {
		case PortType.Input:
            if (name != null) {
                port["id"] += "-in";
            }
			port["group"] = "in";
			port["attrs"]["circle"]["fill"] = "green";
		break;
		case PortType.Output:
            if (name != null) {
                port["id"] += "-out";
            }
			port["group"] = "out";
			port["attrs"]["circle"]["fill"] = "red";
		break;
		case PortType.Trigger:
            if (name != null) {
                port["id"] += "-trigger"; // TODo more info
            }
			port["group"] = "out";
			port["attrs"]["circle"]["fill"] = "blue";
        break;
        case PortType.Execute:
            if (name != null) {
                port["id"] += "-execute"; // TODo more info
            }
            port["group"] = "in";
            port["attrs"]["circle"]["fill"] = "blue";
		break;
	}

	return port;
}

// joint.shapes.basic.flowNode = joint.shapes.basic.Generic.extend({
//     markup: '<g class="rotatable"><g class="scalable"><rect class="titlebox"/></g><text class="title"></text></g>',
//     defaults: joint.util.deepSupplement({
//         type: 'basic.flowNode',
//         attrs: {
//             '.titlebox': { fill: "#F2F2F2", stroke: 'black', width: 40, height: 40, rx: 1, ry: 1 },
//                 // '.attrs': { fill: 'red', stroke: 'black', 'y': 40, width: 40, height: 40 },
//                 '.title': { 'font-size': 18, 'ref-x': .5, 'ref-y': .5, ref: 'rect', 'y-alignment': 'middle', 'x-alignment': 'middle' },
//             }
//         }, joint.shapes.basic.Generic.prototype.defaults)
// });
let FlowNodeShape = joint.dia.Element.define('shapes.flowNode', {
    attrs: {
        body: {
            refWidth: '100%',
            refHeight: '100%',
            strokeWidth: 2,
            stroke: 'black',
            fill: 'white',
        },
        label: {
            textVerticalAnchor: 'middle',
            textAnchor: 'middle',
            refX: '50%',
            refY: '50%',
            fontSize: 14,
            fill: 'black',
            pointerEvents: 'none',
        },
        button: {
            cursor: 'pointer',
            width: '15px',
            height: '15px',
            refX: '0%',
            refY: '0%',
        },

    },
    ports: {
        groups: {
            'out': {
                position: {
                    name: 'right',
                },
            },
            'in': {
                position: {
                    name: 'left',
                },
            }
        }
    }
    }, {
    markup: [{
        tagName: 'rect',
        selector: 'body',
    }, {
        tagName: 'text',
        selector: 'label'
    }, {
        tagName: 'rect',
        selector: 'button'
    }, {
        tagName: 'text',
        selector: 'buttonLabel'
    }],

});