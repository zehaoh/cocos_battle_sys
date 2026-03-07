import { System } from '../../core/ecs/System';
import type { World } from '../../core/ecs/World';
import { MathUtil } from '../../core/math/MathUtil';
import { ProjectileComponent } from '../components/ProjectileComponent';
import { TransformComponent } from '../components/TransformComponent';

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
  }
}
