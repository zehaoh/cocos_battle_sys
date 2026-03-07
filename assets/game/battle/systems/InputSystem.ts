import { System } from '../../core/ecs/System';
import type { World } from '../../core/ecs/World';
import type { InputCommand } from '../input/InputCommand';

export class InputSystem extends System {
  private readonly queue: InputCommand[] = [];

  constructor() {
    super(1);
  }

  public pushCommand(command: InputCommand): void {
    this.queue.push(command);
  }

  public update(world: World, _dt: number): void {
    while (this.queue.length > 0) {
      const cmd = this.queue.shift() as InputCommand;
      world.eventBus.emit('inputCommand', cmd);
    }
  }
}
