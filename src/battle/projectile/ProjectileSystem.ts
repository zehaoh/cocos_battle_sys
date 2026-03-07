import { System } from '../../core/ecs/System';
import type { World } from '../../core/ecs/World';
import { SystemPriority } from '../../core/ecs/SystemPriority';

export class ProjectileSystem extends System {
  constructor() {
    super(SystemPriority.PROJECTILE);
  }

  public override onAttach(world: World): void {
    super.onAttach(world);
    this.world.eventBus.on('SpawnProjectileEvent', (event) => {
      this.emit('ProjectileSpawnedEvent', event);
    });
  }

  public update(_world: World, _dt: number): void {
    // update projectile movement/collision
  }
}
