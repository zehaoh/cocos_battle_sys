import { System } from '../../core/ecs/System';
import type { World } from '../../core/ecs/World';

export class SummonSystem extends System {
  constructor() {
    super(45);
  }

  public update(_world: World, _dt: number): void {
    // event-driven summon bridge is installed in BattleRuntime.
  }
}
