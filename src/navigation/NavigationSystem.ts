import { System } from '../core/ecs/System';
import type { World } from '../core/ecs/World';
import { SystemPriority } from '../core/ecs/SystemPriority';

export class NavigationSystem extends System {
  constructor() {
    super(SystemPriority.NAVIGATION);
  }

  public update(_world: World, _dt: number): void {
    // process PathComponent movement
  }
}
