import type { World } from '../core/ecs/World';
import { CommandQueue } from './CommandQueue';
import { SnapshotSystem } from './SnapshotSystem';

export class BattleSimulator {
  public readonly commandQueue = new CommandQueue();
  public readonly snapshotSystem = new SnapshotSystem();
  public frame = 0;

  constructor(private readonly world: World) {}

  public tick(dt: number): void {
    this.frame += 1;
    const commands = this.commandQueue.pop(this.frame);
    for (const command of commands) {
      this.world.eventBus.emit('CommandEvent', command);
    }
    this.world.update(dt);
    this.snapshotSystem.record(this.frame, { entityCount: this.world.entities.size });
  }
}
