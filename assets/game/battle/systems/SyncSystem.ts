import { System } from '../../core/ecs/System';
import type { World } from '../../core/ecs/World';
import { CombatComponent } from '../components/CombatComponent';
import { TransformComponent } from '../components/TransformComponent';
import type { ServerSync } from '../network/ServerSync';

export class SyncSystem extends System {
  private tick = 0;

  constructor(private readonly sync: ServerSync) {
    super(90);
  }

  public update(world: World, _dt: number): void {
    this.tick += 1;
    const entities: Array<Record<string, unknown>> = [];

    for (const entity of world.query(['Transform', 'Combat'])) {
      const transform = entity.get<TransformComponent>('Transform') as TransformComponent;
      const combat = entity.get<CombatComponent>('Combat') as CombatComponent;
      entities.push({
        id: entity.id,
        x: transform.x,
        y: transform.y,
        hp: combat.hp,
        alive: combat.alive,
      });
    }

    this.sync.pushSnapshot({
      tick: this.tick,
      state: { entities },
    });
  }
}
