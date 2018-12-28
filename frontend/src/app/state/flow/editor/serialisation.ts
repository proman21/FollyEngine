export interface IFlowGraph {
  variables: IVariable[];
  entrypoints: number[];
  nodes: INode[];
  comments: IComment[];
}

export const emptyIGraph: IFlowGraph = {
  variables: [],
  entrypoints: [],
  nodes: [],
  comments: []
};

export interface INode {
  position: [number, number];
  id: number;
  def: string;
  connections: {[id: string]: INodeConnection | IConst}
}

export interface IConst {
  type: "const";
  value: any;
}

export interface IVariable {
  position: [number, number];
  name: string;
  type: string;
  value?: any;
  connections?: INodeConnection[];
}

export interface INodeConnection {
  type: "connection";
  value: {
    node: number,
    pin: string
  };
}

export interface IComment {
  comment: string;
  attached: number[];
}

export interface IControlPin {
  kind: "control";
  name: string;
  label: string;
  required?: boolean;
}

export interface IDataPin {
  kind: "data";
  name: string;
  label: string;
  type: string;
  defaultValue?: any;
  required?: boolean;
}

export interface INodeDescriptor {
  name: string;
  description: string;
  inputs: Array<IControlPin | IDataPin>;
  outputs: Array<IControlPin | IDataPin>;
}

export interface IDefinitionCategory {
  name: string;
  description: string;
  nodes: { [id: string]: INodeDescriptor }
}
