import { System } from '../../core/ecs/System';
import type { World } from '../../core/ecs/World';
import { ProjectileComponent } from '../components/ProjectileComponent';

export type ProjectileTick = (projectileId: number, dt: number) => void;

export class ProjectileSystem extends System {
  constructor(private readonly tickProjectile: ProjectileTick) {
    super(50);
  }

  public update(world: World, dt: number): void {
    for (const entity of world.query(['Projectile'])) {
      const projectile = entity.get<ProjectileComponent>('Projectile') as ProjectileComponent;
      if (projectile.homing) {
        this.tickProjectile(entity.id, dt);
      }
    }
  }
}
