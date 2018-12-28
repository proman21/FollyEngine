import { ID } from "@datorama/akita";

export interface Project {
  id: ID;
  title: string;
  description: string;
  slug: string;
}

export function createProject({
  id = null,
  title = '',
  description = '',
  slug = ''
}: Partial<Project>) : Project {
  return {
    id,
    title,
    description,
    slug
  }
}
