import { System } from '../../core/ecs/System';
import type { World } from '../../core/ecs/World';
import { SystemPriority } from '../../core/ecs/SystemPriority';
import { DamageCalculator } from './DamageCalculator';
import type { DamageContext } from './DamageContext';

export class CombatSystem extends System {
  constructor() {
    super(SystemPriority.COMBAT);
  }

  public override onAttach(world: World): void {
    super.onAttach(world);
    this.world.eventBus.on('DamageEvent', (event) => {
      const payload = event as DamageContext & {
        hitRate?: number; dodgeRate?: number; blockRate?: number; critRate?: number; critMultiplier?: number;
        resistance?: number; shield?: number;
      };
      DamageCalculator.calculate(payload);
    });
  }

  public update(_world: World, _dt: number): void {
    // event-driven
  }
}
