import { BaseComponent } from '../../core/ecs/Component';

export interface SkillRuntime {
  cooldown: number;
  cooldownLeft: number;
  castTime: number;
  castingLeft: number;
}

export class SkillComponent extends BaseComponent {
  public readonly type = 'Skill';
  public readonly skills = new Map<string, SkillRuntime>();

  public registerSkill(skillId: string, cooldown: number, castTime = 0): void {
    this.skills.set(skillId, {
      cooldown,
      cooldownLeft: 0,
      castTime,
      castingLeft: 0,
    });
  }
}
