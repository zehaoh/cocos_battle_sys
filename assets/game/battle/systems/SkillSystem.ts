import { System } from '../../core/ecs/System';
import type { World } from '../../core/ecs/World';
import { SkillComponent } from '../components/SkillComponent';
import { TargetComponent } from '../components/TargetComponent';

export type SkillCaster = (skillId: string, casterId: number, targetId: number | null) => void;

export class SkillSystem extends System {
  constructor(private readonly cast: SkillCaster) {
    super(30);
  }

  public update(world: World, dt: number): void {
    for (const entity of world.query(['Skill'])) {
      const skillComp = entity.get<SkillComponent>('Skill') as SkillComponent;
      const targetComp = entity.get<TargetComponent>('Target');

      for (const [skillId, runtime] of skillComp.skills) {
        runtime.cooldownLeft = Math.max(0, runtime.cooldownLeft - dt);
        runtime.castingLeft = Math.max(0, runtime.castingLeft - dt);
        if (runtime.cooldownLeft > 0 || runtime.castingLeft > 0) continue;

        runtime.castingLeft = runtime.castTime;
        runtime.cooldownLeft = runtime.cooldown;
        this.cast(skillId, entity.id, targetComp?.targetId ?? null);
      }
    }
  }
}
