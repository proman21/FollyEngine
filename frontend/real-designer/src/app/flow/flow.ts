import { DesignerEntity, DesignerComponent, DesignerAttribute, } from '../designer/designer';
import { EditorNode, EntityEditorNode } from '../procedure-designer/editor/editor.parts'
import { DesignerService } from '../designer/designer.service';

export enum PortType {
	Input, // Standard input assignment
	Output, // Standard output value
	Trigger, // Fired on an event associated with the port. May contain additional info
    Execute, // Executes the attached node when an attached trigger fires
}

export enum Conditionals {
    Equal,
    NotEqual,
    Less,
    Greater,
    GreaterEq,
    LessEq,
}

export enum Operation {
    Add,
    Subtract,
    Multiply,
    Divide,
    Set,
    Negate,
}

export enum Action {
    Message,
    Sound,
    Procedure,
    Other,
}

// Represents a flow
export class Flow {
	// Nodes (Unique ID)
	nodes: Map<string, FlowNode> = new Map<string, FlowNode>();

	// Edges connecting two ports together (Unique ID)
	edges: Map<string, FlowEdge> = new Map<string, FlowEdge>();

	nNumGen: NumGen = new NumGen();
	eNumGen: NumGen = new NumGen();

	addNode(node: FlowNode) {
		let id = node.getIDPrefix() + "-" + this.nNumGen.gen();
		this.nodes.set(id, node);
		node.setId(id);
	}

	addEdge(fromEntity: string, toEntity: string, from: string, to: string): string {
		let l = this.nodes.get(fromEntity);
		let r = this.nodes.get(toEntity);
		let id = r.getIDPrefix() + "-" + from + "-" + to + "-" + r.getIDPrefix() + "-" + this.eNumGen.gen();
		// TODO checking the ports actually exist
		let edge = new FlowEdge(fromEntity, toEntity, from, to); // Todo type checking

		this.edges.set(id, edge);
		return id;
	}

	removeEdge(id: string): boolean {
		return this.edges.delete(id);
	}
}

export abstract class FlowNode {
	id: string; // Id of this node
	pNumGen: NumGen = new NumGen();
	ports: Map<string, FlowPort> = new Map<string, FlowPort>();

	addPort(type: PortType, data: DataType): string {
		let id = type + "-" + data + "-" + this.pNumGen.gen();
		let port = new FlowPort(type, data);

		this.ports.set(id, port);
		return id;
	}

	removePort(id: string): boolean {
		return this.ports.delete(id);
	}

	setId(id: string) {
		this.id = id;
	}

	abstract getIDPrefix(): string;

}

export class EntityFlowNode extends FlowNode {
	constructor(private entityID: number) {
		super();
	}

	getIDPrefix(): string {
		return "E-" + this.entityID;
	}

	getEnt(designerService: DesignerService): DesignerEntity {
		return designerService.getEntities().get(this.entityID);
	}
}

export class IfLogicFlowNode extends FlowNode {
	constructor(private conditional: Conditionals) {
		super();
	}

	getIDPrefix(): string {
		return "IF-";
	}

	getConditional(): Conditionals {
		return this.conditional;
	}

	setConditional(cond: Conditionals) {
		this.conditional = cond;
	}
}

export class ConstLogicFlowNode extends FlowNode {
	constructor(private val: any) {
		super();
	}

	getIDPrefix(): string {
		return "CONST-";
	}

	getVal(): any {
		return this.val;
	}
}

export class OperationLogicFlowNode extends FlowNode {
	constructor(private operation: Operation) {
		super();
	}

	getIDPrefix(): string {
		return "OPER-";
	}

	getOperation(): Operation {
		return this.operation;
	}

	setOperation(op: Operation) {
		this.operation = op;
	}
}

export class ActionLogicFlowNode extends FlowNode {
	constructor(private action: Action) {
		super();
	}

	getIDPrefix(): string {
		return "OPER-";
	}

	getAction(): Action {
		return this.action;
	}

	setAction(act: Action) {
		this.action = act;
	}
}
// FlowEdge
// Connects two ports together
// Contains two Entity ids (left and right)
// Contains two Port ids (associated with their respective entities)
export class FlowEdge {
	constructor(fromEntity: string, toEntity: string, fromPort: string, toPort: string) {
		this.fromEntity = fromEntity;
		this.toEntity = toEntity;
		this.fromPort = fromPort;
		this.toPort = toPort;
	}

	fromEntity: string;
	toEntity: string;

	fromPort: string;
	toPort: string;
}

export enum DataType {
	None, // Holds no data (for triggers)
}

export class FlowPort {
	pType: PortType;
	dataType: DataType;

	constructor(pType: PortType, dataType: DataType) {
		this.pType = pType;
		this.dataType = dataType;
	}

	getType(): PortType {
		return this.pType;
	}
}

class NumGen {
	num: number = 0;
	gen() {
		return this.num++;
	}
}