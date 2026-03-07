import type { SkillNode } from './SkillNode';

export interface SkillGraph {
  id: string;
  entry: string;
  nodes: SkillNode[];
}
