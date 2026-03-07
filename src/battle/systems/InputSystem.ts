import { System } from '../../core/ecs/System';
import { SystemPriority } from '../../core/ecs/SystemPriority';

export class InputSystem extends System {
  private time = 0;
  constructor() { super(SystemPriority.INPUT); }
  public update(dt: number): void {
    this.time += dt;
    if (this.time >= 1) {
      this.time = 0;
      this.world.eventBus.emit('INPUT_TICK', { dt });
    }
  }
}
