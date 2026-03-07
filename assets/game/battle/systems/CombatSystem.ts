import { System } from '../../core/ecs/System';
import type { World } from '../../core/ecs/World';
import { MathUtil } from '../../core/math/MathUtil';
import { DamageType } from '../combat/DamageType';
import type { DamageRequest } from '../combat/DamageRequest';
import { AnimationEventComponent } from '../animation/AnimationEventComponent';
import type { AnimationEvent } from '../animation/AnimationEvent';
import { CombatComponent } from '../components/CombatComponent';
import { TargetComponent } from '../components/TargetComponent';
import { TransformComponent } from '../components/TransformComponent';

const DEFAULT_ATTACK_EVENTS: AnimationEvent[] = [
  { frame: 10, type: 'spawn_hitbox' },
  { frame: 12, type: 'damage', params: { damageMultiplier: 1 } },
  { frame: 20, type: 'end' },
];

export class CombatSystem extends System {
  constructor() {
    super(40);
  }

  public update(world: World, dt: number): void {
    for (const entity of world.query(['Combat', 'Target', 'Transform'])) {
      const combat = entity.get<CombatComponent>('Combat') as CombatComponent;
      const target = entity.get<TargetComponent>('Target') as TargetComponent;
      const transform = entity.get<TransformComponent>('Transform') as TransformComponent;
      const animation = entity.get<AnimationEventComponent>('AnimationEvent');
      if (!combat.alive || target.targetId === null) continue;

      combat.cooldownLeft = Math.max(0, combat.cooldownLeft - dt);
      const targetEntity = world.getEntity(target.targetId);
      if (!targetEntity) {
        target.targetId = null;
        continue;
      }

      const targetCombat = targetEntity.get<CombatComponent>('Combat');
      const targetTransform = targetEntity.get<TransformComponent>('Transform');
      if (!targetCombat?.alive || !targetTransform) {
        target.targetId = null;
        continue;
      }

      const dist = MathUtil.distance(transform, targetTransform);
      if (dist <= combat.attackRange && combat.cooldownLeft <= 0) {
        if (animation && !animation.playing) {
          world.eventBus.emit('animationPlayRequest', {
            entityId: entity.id,
            events: DEFAULT_ATTACK_EVENTS,
            targetId: target.targetId,
            skillId: 0,
          });
        } else {
          world.eventBus.emit('damageRequest', {
            attackerId: entity.id,
            targetId: target.targetId,
            skillId: 0,
            damage: combat.attack,
            damageType: DamageType.Physical,
            critRate: 0.1,
            critMultiplier: 1.5,
          } as DamageRequest);
        }
        combat.cooldownLeft = combat.attackCooldown;
      }
    }
  }
}
