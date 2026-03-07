import { HealthComponent } from '../battle/components/HealthComponent';
import { TransformComponent } from '../battle/components/TransformComponent';
import type { World } from '../core/ecs/World';
import { CommandQueue } from './CommandQueue';
import { SnapshotSystem } from './SnapshotSystem';

export class BattleSimulator {
  public frame = 0;
  public readonly queue = new CommandQueue();
  public readonly snapshots = new SnapshotSystem();

  constructor(public readonly world: World, public readonly fixedStep = 1 / 10) {}

  public tick(): void {
    this.frame += 1;
    for (const cmd of this.queue.pop(this.frame)) {
      this.world.eventBus.emit(cmd.type, cmd.params);
    }
    this.world.update(this.fixedStep);

    this.snapshots.add({
      frame: this.frame,
      entities: [...this.world.entityManager.values()].map((e) => {
        const hp = e.getComponent<HealthComponent>('Health');
        const tr = e.getComponent<TransformComponent>('Transform');
        return { id: e.id, hp: hp?.hp, x: tr?.position.x, y: tr?.position.y };
      }),
    });
  }
}
