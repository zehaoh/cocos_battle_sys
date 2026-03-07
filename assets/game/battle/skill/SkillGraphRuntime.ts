import type { BattleWorld } from '../BattleWorld';

export interface StartSkillEvent {
  casterId: number;
  skillId: string;
  targetId: number | null;
}

export class SkillGraphRuntime {
  constructor(private readonly battleWorld: BattleWorld) {}

  public startSkill(event: StartSkillEvent): void {
    this.battleWorld.castSkill(event.skillId, event.casterId, event.targetId);
  }
}
