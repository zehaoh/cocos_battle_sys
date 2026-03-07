import { System } from '../../core/ecs/System';
import type { World } from '../../core/ecs/World';
import { CombatComponent } from '../components/CombatComponent';

export class UnitSystem extends System {
  private readonly known = new Set<number>();

  constructor() {
    super(2);
  }

  public update(world: World, _dt: number): void {
    const current = new Set<number>();

    for (const entity of world.query(['Combat'])) {
      const combat = entity.get<CombatComponent>('Combat') as CombatComponent;
      if (!combat.alive) continue;
      current.add(entity.id);

      if (!this.known.has(entity.id)) {
        this.known.add(entity.id);
        world.eventBus.emit('unitSpawned', { entityId: entity.id, team: combat.team });
      }
    }

    for (const id of [...this.known]) {
      if (!current.has(id)) {
        this.known.delete(id);
        world.eventBus.emit('unitDespawned', { entityId: id });
      }
    }
  }
}
