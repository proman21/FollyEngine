import { ID } from "@datorama/akita";
import { emptyIGraph, IFlowGraph } from "./editor/serialisation";
import { DesignerResource } from "../designer";

export interface Flow extends DesignerResource {
  id: ID,
  name: string,
  description: string,
  graph: IFlowGraph
}

export function createFlow({
  id = null, name = '', description = '', graph = emptyIGraph
}) {
  return {
    id,
    name,
    description,
    graph
  };
}
