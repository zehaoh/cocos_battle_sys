import { System } from '../../core/ecs/System';
import type { World } from '../../core/ecs/World';

export class DropSystem extends System {
  constructor() {
    super(95);
  }

  public update(_world: World, _dt: number): void {
    // event-driven: handled via BattleRuntime drop listeners
  }
}
