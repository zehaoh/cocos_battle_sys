import type { World } from '../../core/ecs/World';
import { CommandQueue, type Command } from './CommandQueue';
import { SimulationClock } from './SimulationClock';
import { SnapshotSystem } from './SnapshotSystem';

export class BattleSimulator {
  public readonly queue = new CommandQueue();
  public readonly clock: SimulationClock;
  public readonly snapshots = new SnapshotSystem();

  constructor(
    private readonly world: World,
    fixedStep = 1 / 30,
  ) {
    this.clock = new SimulationClock(fixedStep);
  }

  public enqueue(type: string, entity: number, params: Record<string, unknown> | undefined, frame: number): void {
    this.queue.push({ frame, type, entity, params });
  }

  public update(dt: number): void {
    const startFrame = this.clock.getFrame();
    const frames = this.clock.consumeFrames(dt);
    for (let i = 1; i <= frames; i++) {
      this.stepFrame(startFrame + i);
    }
  }

  public getCurrentFrame(): number {
    return this.clock.getFrame();
  }

  private stepFrame(frame: number): void {
    const commands = this.queue.pop(frame);
    for (const command of commands) {
      this.executeCommand(command);
    }

    this.world.update(this.clock.fixedStep);
    this.snapshots.snapshot(this.world, frame);
  }

  private executeCommand(command: Command): void {
    this.world.eventBus.emit('executeCommand', command);
  }
}
