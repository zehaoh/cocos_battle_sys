import type { World } from '../../core/ecs/World';
import { DamageType } from '../combat/DamageType';
import type { DamageRequest } from '../combat/DamageRequest';
import { CombatComponent } from '../components/CombatComponent';
import type { AnimationEvent } from './AnimationEvent';
import { AnimationEventComponent } from './AnimationEventComponent';

export class AnimationEventDispatcher {
  public dispatch(world: World, entityId: number, event: AnimationEvent): void {
    switch (event.type) {
      case 'spawn_hitbox':
        world.eventBus.emit('spawnHitbox', {
          casterId: entityId,
          targetId: this.extractTarget(event, null),
          skillId: this.extractSkillId(event, 0),
        });
        break;
      case 'damage':
        this.applyDamage(world, entityId, event);
        break;
      case 'end':
        this.endAnimation(world, entityId);
        break;
    }
  }

  private applyDamage(world: World, entityId: number, event: AnimationEvent): void {
    const entity = world.getEntity(entityId);
    const combat = entity?.get<CombatComponent>('Combat');
    const animation = entity?.get<AnimationEventComponent>('AnimationEvent');
    if (!combat || !animation) return;

    const targetId = this.extractTarget(event, animation.targetId);
    if (targetId === null) return;

    const multiplier = typeof event.params?.damageMultiplier === 'number' ? event.params.damageMultiplier : 1;
    const damage = combat.attack * multiplier;

    world.eventBus.emit('damageRequest', {
      attackerId: entityId,
      targetId,
      skillId: this.extractSkillId(event, animation.skillId),
      damage,
      damageType: DamageType.Physical,
      critRate: 0.1,
      critMultiplier: 1.5,
    } as DamageRequest);
  }

  private endAnimation(world: World, entityId: number): void {
    const entity = world.getEntity(entityId);
    const animation = entity?.get<AnimationEventComponent>('AnimationEvent');
    if (!animation) return;

    const finishedSkillId = animation.skillId;
    animation.playing = false;
    animation.currentFrame = 0;
    animation.events = [];
    animation.targetId = null;
    animation.skillId = 0;

    world.eventBus.emit('animationEnded', { entityId, skillId: finishedSkillId });
  }

  private extractTarget(event: AnimationEvent, fallback: number | null): number | null {
    const candidate = event.params?.targetId;
    return typeof candidate === 'number' ? candidate : fallback;
  }

  private extractSkillId(event: AnimationEvent, fallback: number): number {
    const candidate = event.params?.skillId;
    return typeof candidate === 'number' ? candidate : fallback;
  }
}
