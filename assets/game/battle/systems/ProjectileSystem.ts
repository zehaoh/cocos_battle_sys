import { System } from '../../core/ecs/System';
import type { World } from '../../core/ecs/World';
import { MathUtil } from '../../core/math/MathUtil';
import { CombatComponent } from '../components/CombatComponent';
import { ProjectileComponent } from '../components/ProjectileComponent';
import { TransformComponent } from '../components/TransformComponent';

export interface ProjectileHitEvent {
  projectileEntityId: number;
  projectileId: number;
  casterId: number;
  targetId: number;
  damage: number;
}

export class ProjectileSystem extends System {
  constructor() {
    super(50);
  }

  public update(world: World, dt: number): void {
    for (const projectileEntity of world.query(['Projectile', 'Transform'])) {
      const projectile = projectileEntity.get<ProjectileComponent>('Projectile') as ProjectileComponent;
      const transform = projectileEntity.get<TransformComponent>('Transform') as TransformComponent;

      projectile.age += dt;
      if (projectile.age >= projectile.lifeTime) {
        world.destroyEntity(projectileEntity.id);
        continue;
      }

      this.move(world, transform, projectile, dt);
      this.checkCollision(world, projectileEntity.id, transform, projectile);
    }
  }

  private move(world: World, transform: TransformComponent, projectile: ProjectileComponent, dt: number): void {
    if (projectile.behavior === 'Homing' || projectile.behavior === 'Bounce') {
      if (projectile.targetId !== null) {
        const target = world.getEntity(projectile.targetId);
        const targetTransform = target?.get<TransformComponent>('Transform');
        if (targetTransform) {
          const dir = MathUtil.normalize({ x: targetTransform.x - transform.x, y: targetTransform.y - transform.y });
          projectile.directionX = dir.x;
          projectile.directionY = dir.y;
        }
      }
    }

    transform.x += projectile.directionX * projectile.speed * dt;
    transform.y += projectile.directionY * projectile.speed * dt;
  }

  private checkCollision(
    world: World,
    projectileEntityId: number,
    transform: TransformComponent,
    projectile: ProjectileComponent,
  ): void {
    const caster = world.getEntity(projectile.casterId);
    const casterCombat = caster?.get<CombatComponent>('Combat');
    if (!casterCombat) return;

    const candidates = world.query(['Combat', 'Transform']);
    for (const candidate of candidates) {
      if (candidate.id === projectile.casterId) continue;
      if (projectile.hitTargets.has(candidate.id)) continue;

      const targetCombat = candidate.get<CombatComponent>('Combat') as CombatComponent;
      const targetTransform = candidate.get<TransformComponent>('Transform') as TransformComponent;
      if (!targetCombat.alive) continue;
      if (targetCombat.team === casterCombat.team) continue;

      const dist = MathUtil.distance(transform, targetTransform);
      if (dist > projectile.radius) continue;

      projectile.hitTargets.add(candidate.id);
      world.eventBus.emit('projectileHit', {
        projectileEntityId,
        projectileId: projectile.projectileId,
        casterId: projectile.casterId,
        targetId: candidate.id,
        damage: projectile.damage,
      } as ProjectileHitEvent);

      projectile.penetrate -= 1;
      if (projectile.behavior === 'Bounce' && projectile.bounceLeft > 0) {
        const nextTarget = this.findNearestUntouchedEnemy(world, projectile, transform, casterCombat.team, candidate.id);
        if (nextTarget !== null) {
          projectile.targetId = nextTarget;
          projectile.bounceLeft -= 1;
          if (projectile.penetrate > 0) continue;
          projectile.penetrate = 1;
          continue;
        }
      }

      if (projectile.behavior === 'Split' && projectile.splitCount > 0) {
        projectile.splitCount -= 1;
        world.eventBus.emit('projectileSplit', {
          projectileId: projectile.projectileId,
          casterId: projectile.casterId,
          fromTargetId: candidate.id,
          splitCount: 2,
        });
      }

      if (projectile.penetrate <= 0) {
        world.destroyEntity(projectileEntityId);
        return;
      }
    }
  }

  private findNearestUntouchedEnemy(
    world: World,
    projectile: ProjectileComponent,
    from: TransformComponent,
    team: number,
    ignoreId: number,
  ): number | null {
    let bestId: number | null = null;
    let bestDistSq = Number.POSITIVE_INFINITY;

    for (const entity of world.query(['Combat', 'Transform'])) {
      if (entity.id === ignoreId || entity.id === projectile.casterId) continue;
      if (projectile.hitTargets.has(entity.id)) continue;

      const combat = entity.get<CombatComponent>('Combat') as CombatComponent;
      const transform = entity.get<TransformComponent>('Transform') as TransformComponent;
      if (!combat.alive || combat.team === team) continue;

      const dx = transform.x - from.x;
      const dy = transform.y - from.y;
      const distSq = dx * dx + dy * dy;
      if (distSq < bestDistSq) {
        bestDistSq = distSq;
        bestId = entity.id;
      }
    }

    return bestId;
  }
}
