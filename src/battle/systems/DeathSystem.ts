import { System } from '../../core/ecs/System';
import { SystemPriority } from '../../core/ecs/SystemPriority';
import { EngineEvent } from '../../core/event/EventTypes';

export class DeathSystem extends System {
  constructor() { super(SystemPriority.RENDER - 100); }
  public onAttach(world: import('../../core/ecs/World').World): void {
    super.onAttach(world);
    this.world.eventBus.on(EngineEvent.DEATH, (ev) => {
      const e = ev as { deadId: number };
      this.world.entityManager.remove(e.deadId);
    });
    this.world.eventBus.on('UNIT_DEAD_PENDING', (ev) => {
      const e = ev as { deadId: number };
      this.world.eventBus.emit(EngineEvent.DEATH, e);
    });
  }
  public update(): void {}
}
