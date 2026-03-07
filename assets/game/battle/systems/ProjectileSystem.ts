import { System } from '../../core/ecs/System';
import type { World } from '../../core/ecs/World';

export interface ProjectileStepRequest {
  projectileId: number;
  dt: number;
}

export class ProjectileSystem extends System {
  constructor() {
    super(50);
  }

  public update(world: World, dt: number): void {
    for (const entity of world.query(['Projectile'])) {
      world.eventBus.emit('projectileStepRequest', {
        projectileId: entity.id,
        dt,
      } as ProjectileStepRequest);
    }
  }
}
