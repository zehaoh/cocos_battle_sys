import type { World } from '../../core/ecs/World';

export interface SkillContext {
  caster: number;
  target?: number;
  world: World;
  skillId: string;
}
