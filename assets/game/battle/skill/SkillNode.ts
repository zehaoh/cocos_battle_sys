import type { BattleWorld } from '../BattleWorld';
import type { SkillGraph, SkillNodeData } from './SkillGraph';

export interface SkillContext {
  casterId: number;
  targetId: number | null;
  world: BattleWorld;
  graph: SkillGraph;
  skillLevel?: number;
}

export interface SkillNodeResult {
  nextNodeIds?: number[];
  stop?: boolean;
}

export interface SkillNode {
  execute(node: SkillNodeData, ctx: SkillContext): SkillNodeResult | void;
}
