import { System } from '../../core/ecs/System';
import { SystemPriority } from '../../core/ecs/SystemPriority';
import { EngineEvent } from '../../core/event/EventTypes';

export class HitSystem extends System {
  constructor() { super(SystemPriority.COMBAT - 10); }
  public update(): void {
    // Hit check would resolve hitbox contacts and emit ATTACK events.
    this.world.eventBus.emit(EngineEvent.ATTACK, null);
  }
}
