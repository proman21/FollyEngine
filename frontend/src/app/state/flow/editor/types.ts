import { DesignerEntity } from "../../entity/entity.model";
import { DesignerComponent } from "../../component/component.model";

export class NodeDescriptor {
  id: string;
  name: string;
  description: string;
  inputs: Map<string, Pin>;
  outputs: Map<string, Pin>;

  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
    this.inputs = new Map();
    this.outputs = new Map();
  }
}

export interface Pin {
  label: string;
  required: boolean;
  kind: string;
}

export class ControlPin implements Pin {
  label: string;
  required: boolean;
  kind = "Control";

  constructor(label: string, required: boolean) {
    this.label = label;
    this.required = required;
  }
}

export class DataPin implements Pin {
  label: string;
  type: Type;
  defaultValue?: any;
  required: boolean;

  get kind() {
    return this.type.name;
  }

  constructor(label: string, type: Type, defaultValue: any, required: boolean) {
    this.label = label;
    this.type = type;
    this.defaultValue = defaultValue;
    this.required = required;
  }
}

// Reserved for basic types.
export class Type {
  constructor(public name: string, public description: string) {}

  serialized(): string {
    return this.name;
  }
}

// Describes the array type.
export class ArrayType extends Type {
  constructor(public inner: Type) {
    super(`Array<${inner.name}>`, `A list of ${inner.name}.`);
  }

  serialized(): string {
    return `${this.inner.serialized()}[]`;
  }
}

// Wraps a project entity to describe it's type.
export class EntityType extends Type {
  constructor(public entity: DesignerEntity) {
    super(entity.name, entity.description);
  }
}

// A Type that requires a set of DesignerComponent implementations.
export class ComponentType extends Type {
  constructor(public component: DesignerComponent) {
    super(component.name, component.description);
  }
}
