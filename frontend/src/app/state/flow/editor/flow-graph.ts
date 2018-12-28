import { NodeDescriptor, Type } from "./types";
import { IComment, IConst, IFlowGraph, INode, INodeConnection, IVariable } from "./serialisation";

export class FlowGraph {
  nodes: Map<number, Node>;
  entrypoints: number[];
  comments: Map<number[], Comment>;
  variables: Map<string, Variable>;
  connections: Map<Connection, Connection>;

  constructor() {
    this.nodes = new Map();
    this.entrypoints = [];
    this.comments = new Map();
    this.variables = new Map();
  }

  private static getRandomInt(): number {
    return Math.floor(Math.random() * 2048);
  }

  private static genId(exists: (number) => boolean): number {
    let id = FlowGraph.getRandomInt();
    while(exists(id)) {
      id = FlowGraph.getRandomInt();
    }
    return id;
  }

  serialize(): IFlowGraph {
    return {
      nodes: Array.from(this.nodes.values())
        .map((n) => n.serialize()),
      variables: Array.from(this.variables.values())
        .map((v) => v.serialize()),
      entrypoints: this.entrypoints,
      comments: Array.from(this.comments.values())
        .map((c) => c.serialize())
    };
  }

  addNode(node: Node): number {
    const id = FlowGraph.genId((n) => this.nodes.has(n));
    node.id = id;
    this.nodes.set(id, node);
    return id;
  }

  addVariable(variable: Variable) {
    this.variables.set(variable.name, variable);
  }

  getNode(id: number): Node {
    return this.nodes.get(id);
  }
}

export class Vector2 {
  static get ORIGIN() {
    return new Vector2(0, 0);
  }

  constructor(public x: number, public y: number) {}

  static fromTuple(position: [number, number]) {
    return new Vector2(position[0], position[1]);
  }

  copy(other: Vector2): Vector2 {
    this.x = other.x;
    this.y = other.y;
    return this;
  }

  subtract(other: Vector2): Vector2 {
    this.x -= other.x;
    this.y -= other.y;
    return this;
  }

  toTuple(): [number, number] {
    return [this.x, this.y];
  }

  add(x: number, y: number): Vector2 {
    this.x += x;
    this.y += y;
    return this;
  }
}

export class Node {
  id: number;
  position: Vector2;
  descriptor: NodeDescriptor;
  connections: Map<string, Connection | Const>;

  constructor(pos: Vector2, desc: NodeDescriptor) {
    this.position = pos;
    this.descriptor = desc;
    this.connections = new Map();
  }

  serialize(): INode {
    return {
      id: this.id,
      position: this.position.toTuple(),
      def: this.descriptor.id,
      connections: Array.from(this.connections.entries()).reduce((acc, c) => {
        return Object.assign(acc, { [c[0]]: c[1].serialize() });
      }, {})
    }
  }

  addConnection(selfPin: string, end: Node, endPin: string) {
    const pinDef = this.descriptor.outputs.get(selfPin);
    if (pinDef === null) {
      throw new Error(`Unable to make connection: No pin '${selfPin}' on self`);
    }

    const endPinDef = end.descriptor.inputs.get(endPin);
    if (endPinDef === null) {
      throw new Error(`Unable to make connection: No pin '${endPin}' on end node`);
    }

    if(pinDef.kind !== endPinDef.kind) {
      throw new Error(`Unable to make connection: Input type '${endPinDef.kind}' of '${endPin}' does not equal '${pinDef.kind}' of '${selfPin}'`);
    }

    this.connections.set(selfPin, new Connection(end, endPin));
  }

  addConst(id: string, value: any) {
    const pinDef = this.descriptor.outputs.get(id);
    if (pinDef === null) {
      throw new Error(`Unable to make connection: No pin '${id}' on self`);
    }

    this.connections.set(id, new Const(value));
  }
}

export class Connection {
  constructor (
    public node: Node,
    public pin: string
  ) {}

  serialize(): INodeConnection {
    return {
      type: "connection",
      value: {
        node: this.node.id,
        pin: this.pin
      }
    };
  }
}

export class Const {
  constructor (public value: any) {}

  serialize(): IConst {
    return {
      type: "const",
      value: this.value
    }
  }
}

export class Comment {
  text: string;
  target: Node[];

  serialize(): IComment {
    return {
      comment: this.text,
      attached: this.target.map(n => n.id)
    };
  }
}

export class Variable {
  connections: Map<Node, string>;
  constructor(
    public position: Vector2,
    public type: Type,
    public name: string,
    public defaultValue?: any
  ) {
    this.connections = new Map();
  }

  addConnection(node: Node, pin: string) {
    const pinDef = node.descriptor.inputs.get(pin);
    if(pinDef == null) {
      throw new Error(`Error adding Variable connection: '${pin}' is not a pin on ${node.descriptor.name}`)
    }

    this.connections.set(node, pin);
  }

  serialize(): IVariable {
    return {
      position: this.position.toTuple(),
      name: this.name,
      type: this.type.serialized(),
      connections: Array.from(this.connections.entries())
        .map(([n, p]) => {
          return <INodeConnection> {
            type: "connection",
            value: {
              node: n.id,
              pin: p
            }
          }
        })
    };
  }
}

