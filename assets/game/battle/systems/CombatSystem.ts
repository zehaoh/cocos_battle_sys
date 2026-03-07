import { System } from '../../core/ecs/System';
import type { World } from '../../core/ecs/World';
import { MathUtil } from '../../core/math/MathUtil';
import { CombatComponent } from '../components/CombatComponent';
import { TargetComponent } from '../components/TargetComponent';
import { TransformComponent } from '../components/TransformComponent';

export interface DamageRequest {
  attackerId: number;
  defenderId: number;
  damage: number;
}

export class CombatSystem extends System {
  constructor() {
    super(40);
  }

  public update(world: World, dt: number): void {
    for (const entity of world.query(['Combat', 'Target', 'Transform'])) {
      const combat = entity.get<CombatComponent>('Combat') as CombatComponent;
      const target = entity.get<TargetComponent>('Target') as TargetComponent;
      const transform = entity.get<TransformComponent>('Transform') as TransformComponent;
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
        world.eventBus.emit('damageRequest', {
          attackerId: entity.id,
          defenderId: target.targetId,
          damage: combat.attack,
        } as DamageRequest);
        combat.cooldownLeft = combat.attackCooldown;
      }
    }
  }
}
