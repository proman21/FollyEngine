import { Injectable } from "@angular/core";
import { ArrayType, ControlPin, DataPin, NodeDescriptor, Type } from "./types";
import * as builtins from "./builtins.json";
import { boolType, floatType, intType, strType } from "./intrinsics";
import { IDefinitionCategory, INodeDescriptor } from "./serialisation";
import { Node, Vector2 } from "./flow-graph";
import { ComponentQuery } from "../../component/component.query";
import { DesignerEntityQuery } from "../../entity/entity.query";

export class Category {
  nodes: string[];
  constructor(public name: string, public description: string) {
    this.nodes = [];
  }
}

export class CatNode {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public children: CatNode[]) {
  }
}

@Injectable({
  providedIn: "root"
})
export class FlowEditorService {
  categories: Map<string, Category>;
  descriptors: Map<string, NodeDescriptor>;
  typeLookup: Map<string, Type>;

  get categoryTree() {
    const catArray = [];
    for (const [cid, cat] of this.categories.entries()) {
      const catNode = new CatNode(cid, cat.name, cat.description, []);
      catArray.push(catNode);
      for (const id of cat.nodes) {
        const des = this.descriptors.get(id);
        catNode.children.push(new CatNode(id, des.name, des.description, []));
      }
    }
    return catArray;
  }

  constructor(
    private componentQuery: ComponentQuery,
    private entityQuery: DesignerEntityQuery
  ) {
    this.descriptors = new Map();
    this.typeLookup = new Map();
    this.categories = new Map();
  }

  initialise() {
    this.buildTypeIndex();
    this.parseBuiltins();
  }

  parseBuiltins() {
    for(const [id, cat] of Object.entries(builtins.default)) {
      const icat = <IDefinitionCategory> cat;
      const category = new Category(icat.name, icat.description);
      this.categories.set(id, category);
      for(const [nid, desc] of Object.entries(icat.nodes)) {
        const descriptor = this.createNodeDescriptor(desc);
        descriptor.id = nid;
        this.descriptors.set(nid, descriptor);
        category.nodes.push(nid);
      }
    }
  }
  
  private createNodeDescriptor(idesc: INodeDescriptor): NodeDescriptor {
    const descr = new NodeDescriptor(idesc.name, idesc.description);
    let controlPins: [string, ControlPin][] = [];
    let dataPins: [string, DataPin][] = [];
    for (const ipin of idesc.inputs) {
      // @ts-ignore
      if (ipin === '_') {
        controlPins.splice(0, 0, ["_", new ControlPin("", true)]);
      } else if (ipin.kind === "control") {
        controlPins.push([
          ipin.name,
          new ControlPin(ipin.label, ipin.required || false)
        ]);
      } else {
        const pinType = this.resolveType(ipin.type);
        if (pinType === null) {
          throw new Error(`Error parsing NodeDescriptor '${idesc.name}': No type called '${ipin.type}' for data pin '${ipin.name}'`)
        }
        dataPins.push([
          ipin.name,
          new DataPin(ipin.label,
            pinType,
            ipin.defaultValue,
            ipin.required || false)
        ]);
      }
    }

    for (const [name, pin] of controlPins.concat(dataPins)) {
      if (descr.inputs.get(name)) {
        throw new Error(`Unable to create node descriptor for ${idesc.name}: Two input pins share the '${name}' name`)
      }
      descr.inputs.set(name, pin);
    }

    controlPins = [];
    dataPins = [];
    
    for (const ipin of idesc.outputs) {
      // @ts-ignore
      if (ipin === '_') {
        controlPins.splice(0, 0, ["_", new ControlPin("", true)]);
      } else if (ipin.kind === "control") {
        controlPins.push([
          ipin.name,
          new ControlPin(ipin.label, ipin.required || false)
        ]);
      } else {
        const pinType = this.resolveType(ipin.type);
        if (pinType === null) {
          throw new Error(`Error parsing NodeDescriptor '${idesc.name}': No type called '${ipin.type}' for data pin '${ipin.name}'`)
        }
        dataPins.push([
          ipin.name,
          new DataPin(ipin.label,
            pinType,
            ipin.defaultValue,
            ipin.required || false)
        ]);
      }
    }

    for (const [name, pin] of controlPins.concat(dataPins)) {
      if (descr.outputs.get(name)) {
        throw new Error(`Unable to create node descriptor for ${idesc.name}: Two output pins share the '${name}' name`)
      }
      descr.outputs.set(name, pin);
    }

    return descr;
  }

  buildTypeIndex(): void {
    // Add intrinsics
    this.typeLookup.set("float", floatType);
    this.typeLookup.set("int", intType);
    this.typeLookup.set("str", strType);
    this.typeLookup.set("bool", boolType);
  }

  /**
   * Returns a Type object that represents a type of data in a flow.
   * @param typeName either a primitive type or a fully qualified Entity name.
   */
  resolveType(typeName: string): Type | null {
    // Check if this lookup has been made before.
    let resolved = this.typeLookup.get(typeName);

    if (resolved) {
      return resolved;
    }

    // Check if this is an Array type
    const arrayRe = /Array<(.+)>/;
    const res = arrayRe.exec(typeName);
    if (res) {
      const innerType = this.resolveType(res[1]);
      if (innerType) {
        resolved = new ArrayType(innerType);
        this.typeLookup.set(typeName, resolved);
        return resolved;
      }
    }

    //Check if it's an EntityType


    return null;
  }

  getDescriptor(id: string): NodeDescriptor {
    return this.descriptors.get(id);
  }

  createNode(id: string, newNodePos: Vector2): Node {
    if (!this.descriptors.has(id)) {
      throw new Error(`Unable to create node: No descriptor called '${id}'`);
    }

    const descriptor = this.descriptors.get(id);
    return new Node(newNodePos, descriptor);
  }
}
