import { System } from '../../core/ecs/System';
import type { World } from '../../core/ecs/World';
import { SystemPriority } from '../../core/ecs/SystemPriority';
import { ThreatTable } from './ThreatTable';

export interface ThreatComponent {
  table: ThreatTable;
  currentTarget?: number;
}

export class AggroSystem extends System {
  constructor() {
    super(SystemPriority.AGGRO);
  }

  public override onAttach(world: World): void {
    super.onAttach(world);
    this.world.eventBus.on('DamageEvent', (e) => {
      const event = e as { attacker: number; target: number; value: number };
      this.applyThreat(event.target, event.attacker, event.value);
    });
    this.world.eventBus.on('HealEvent', (e) => {
      const event = e as { source: number; target: number; value: number };
      this.applyThreat(event.target, event.source, event.value);
    });
    this.world.eventBus.on('TauntEvent', (e) => {
      const event = e as { source: number; target: number; value: number };
      this.applyThreat(event.target, event.source, event.value);
    });
  }

  public update(world: World, dt: number): void {
    const decay = Math.pow(0.98, dt);
    for (const entity of world.query(['ThreatComponent'])) {
      const comp = entity.get<ThreatComponent>('ThreatComponent');
      if (!comp) continue;
      for (const [id, value] of comp.table.threat) {
        comp.table.threat.set(id, value * decay);
      }
      comp.currentTarget = comp.table.getHighestThreatTarget();
    }
  }

  private applyThreat(entityId: number, sourceId: number, value: number): void {
    const entity = this.world.getEntity(entityId);
    if (!entity) return;
    const comp = entity.get<ThreatComponent>('ThreatComponent') ?? { table: new ThreatTable() };
    comp.table.add(sourceId, value);
    entity.add({ type: 'ThreatComponent', ...comp });
  }
}
