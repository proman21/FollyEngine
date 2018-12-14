import { Injectable } from "@angular/core";
import { ArrayType, ControlPin, DataPin, NodeDescriptor, Type } from "./types";
import * as builtins from "./builtins.json";
import { boolType, floatType, intType, strType } from "./intrinsics";
import { DesignerService } from "../designer/designer.service";
import { IDefinitionCategory, INodeDescriptor } from "./serialisation";

export class Category {
  nodes: string[];
  constructor(public name: string, public description: string) {
    this.nodes = [];
  }
}

export class CatNode {
  constructor(
    public name: string,
    public description: string,
    public children: CatNode[]) {
  }
}

@Injectable({
  providedIn: "root"
})
export class FlowService {
  categories: Map<string, Category>;
  descriptors: Map<string, NodeDescriptor>;
  typeLookup: Map<string, Type>;

  get categoryTree() {
    const catArray = [];
    for (const [_, cat] of this.categories.entries()) {
      const catNode = new CatNode(cat.name, cat.description, []);
      catArray.push(catNode);
      for (const id of cat.nodes) {
        const des = this.descriptors.get(id);
        catNode.children.push(new CatNode(des.name, des.description, []));
      }
    }
    return catArray;
  }

  constructor(private designer: DesignerService) {
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
        this.descriptors.set(nid,
          this.createNodeDescriptor(desc));
        category.nodes.push(nid);
      }
    }
  }
  
  private createNodeDescriptor(idesc: INodeDescriptor): NodeDescriptor {
    const descr = new NodeDescriptor(idesc.name, idesc.description);
    for (const ipin of idesc.inputs) {
      // @ts-ignore
      if (ipin === '_') {
        descr.inputs.control.set("_", new ControlPin("", true));
      } else if (ipin.kind === "control") {
        if (descr.inputs.control.get(ipin.name)) {
          throw new Error(`Unable to create node descriptor for ${idesc.name}: Two input control pins share the '${ipin.name}' name`)
        }

      } else {
        if (descr.inputs.data.get(ipin.name)) {
          throw new Error(`Unable to create node descriptor for ${idesc.name}: Two input data pins share the '${ipin.name}' name`)
        }
        const pinType = this.resolveType(ipin.type);
        if (pinType === null) {
          throw new Error(`Error parsing NodeDescriptor '${idesc.name}': No type called '${ipin.type}' for data pin '${ipin.name}'`)
        }
        descr.inputs.data.set(ipin.name, new DataPin(ipin.label, pinType,
          ipin.defaultValue, ipin.required || false));
      }
    }
    
    for (const ipin of idesc.outputs) {
      // @ts-ignore
      if (ipin === '_') {
        descr.outputs.control.set("_", new ControlPin("", true));
      } else if (ipin.kind === "control") {
        if (descr.outputs.control.get(ipin.name)) {
          throw new Error(`Unable to create node descriptor for ${idesc.name}: Two output control pins share the '${ipin.name}' name`)
        }
        descr.outputs.control.set(ipin.name, new ControlPin(ipin.label,
          ipin.required || false));
      } else {
        if (descr.outputs.data.get(ipin.name)) {
          throw new Error(`Unable to create node descriptor for ${idesc.name}: Two output data pins share the '${ipin.name}' name`)
        }
        const pinType = this.resolveType(ipin.type);
        if (pinType === null) {
          throw new Error(`Error parsing NodeDescriptor '${idesc.name}': No type called '${ipin.type}' for data pin '${ipin.name}'`)
        }
        descr.outputs.data.set(ipin.name, new DataPin(ipin.label, pinType,
          ipin.defaultValue, ipin.required || false));
      }
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
}
