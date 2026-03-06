import type { BattleWorld } from '../BattleWorld';

export interface SkillContext {
  casterId: number;
  targetId: number | null;
  world: BattleWorld;
}

export interface SkillNode {
  id: string;
  run(ctx: SkillContext): void;
}
