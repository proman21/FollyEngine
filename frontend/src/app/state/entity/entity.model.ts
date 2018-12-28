import { ID} from "@datorama/akita";
import { DesignerResource } from "../designer";

export interface DesignerEntity extends DesignerResource {
  id: ID;
  name: string;
  description: string;
  components: ID[];
}

export function createEntity({
   id = null, name = '', description = '', components = []
}: Partial<DesignerEntity>) {
  return {
    id,
    name,
    description,
    components
  };
}
