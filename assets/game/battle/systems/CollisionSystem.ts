import { System } from '../../core/ecs/System';
import type { World } from '../../core/ecs/World';
import { MathUtil } from '../../core/math/MathUtil';
import { DamageType } from '../combat/DamageType';
import { CombatComponent } from '../components/CombatComponent';
import { ProjectileComponent } from '../components/ProjectileComponent';
import { TransformComponent } from '../components/TransformComponent';

export class CollisionSystem extends System {
  constructor() {
    super(55);
  }

  public update(world: World, _dt: number): void {
    for (const projectileEntity of world.query(['Projectile', 'Transform'])) {
      const projectile = projectileEntity.get<ProjectileComponent>('Projectile') as ProjectileComponent;
      const position = projectileEntity.get<TransformComponent>('Transform') as TransformComponent;

      const caster = world.getEntity(projectile.casterId);
      const casterCombat = caster?.get<CombatComponent>('Combat');
      if (!casterCombat) continue;

      for (const unit of world.query(['Combat', 'Transform'])) {
        if (unit.id === projectile.casterId) continue;
        if (projectile.hitTargets.has(unit.id)) continue;

        const combat = unit.get<CombatComponent>('Combat') as CombatComponent;
        const transform = unit.get<TransformComponent>('Transform') as TransformComponent;
        if (!combat.alive || combat.team === casterCombat.team) continue;

        if (MathUtil.distance(position, transform) > projectile.radius) continue;
        projectile.hitTargets.add(unit.id);

        world.eventBus.emit('projectileHit', {
          projectileEntityId: projectileEntity.id,
          projectileId: projectile.projectileId,
          casterId: projectile.casterId,
          targetId: unit.id,
          damage: projectile.damage,
          damageType: DamageType.Physical,
          critRate: 0.2,
          critMultiplier: 1.5,
          skillId: 0,
        });

        projectile.penetrate -= 1;
        if (projectile.behavior === 'Split' && projectile.splitCount > 0) {
          projectile.splitCount -= 1;
          world.eventBus.emit('projectileSplit', {
            projectileId: projectile.projectileId,
            casterId: projectile.casterId,
            fromTargetId: unit.id,
            splitCount: 2,
          });
        }

        if (projectile.penetrate <= 0) {
          world.destroyEntity(projectileEntity.id);
          break;
        }
      }
    }
  }
}
