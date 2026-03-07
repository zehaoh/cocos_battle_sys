import { System } from '../../core/ecs/System';
import { SystemPriority } from '../../core/ecs/SystemPriority';
import { EngineEvent } from '../../core/event/EventTypes';

export class DebugCombatLogSystem extends System {
  constructor() { super(SystemPriority.RENDER - 1); }
  public onAttach(world: import('../../core/ecs/World').World): void {
    super.onAttach(world);
    this.world.eventBus.on(EngineEvent.DAMAGE, (e) => {
      const d = e as { attackerId: number; targetId: number; amount: number };
      console.log(`[CombatLog] ${d.attackerId} -> ${d.targetId}: ${d.amount}`);
    });
  }
  public update(): void {}
}
