import { ID } from "@datorama/akita";
import { Type } from "../flow/editor/types";
import { DesignerResource } from "../designer";

export function slugify(text: string): string {
  return text.replace(/[^\w\s-]/, '')
    .trim()
    .toLowerCase()
    .replace(/[-\s]+/, '-');
}

export interface Attribute {
  id: string;
  name: string;
  description: string;
  type: Type;
}

export function createAttribute({
  id = '',name = '', description = '', type = null
}: Partial<Attribute>) {
  return {
    id,
    name,
    description,
    type
  }
}

export interface DesignerComponent extends DesignerResource {
  id: ID,
  name: string,
  description: string,
  attributes: Attribute[];
}

export function createComponent({
  id = null, name = '', description = '', attributes = []
}: Partial<DesignerComponent>) {
  return {
    id,
    name,
    description,
    attributes
  }
}
