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
