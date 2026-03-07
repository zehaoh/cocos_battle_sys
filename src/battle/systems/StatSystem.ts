import { BuffComponent } from '../components/BuffComponent';
import { StatsComponent } from '../components/StatsComponent';
import { BuffType } from '../buff/BuffType';
import { System } from '../../core/ecs/System';
import { SystemPriority } from '../../core/ecs/SystemPriority';

export class StatSystem extends System {
  constructor() { super(SystemPriority.BUFF - 5); }
  public update(): void {
    for (const entity of this.world.query(['Stats'])) {
      const stats = entity.getComponent<StatsComponent>('Stats');
      const buffs = entity.getComponent<BuffComponent>('Buff');
      if (!stats || !buffs) continue;
      // Example derived logic: poison lowers attack slightly, shield lowers speed slightly.
      let attackDelta = 0;
      let speedScale = 1;
      for (const b of buffs.buffs) {
        if (b.type === BuffType.Poison) attackDelta -= 1;
        if (b.type === BuffType.Shield) speedScale *= 0.95;
      }
      stats.attack = Math.max(1, stats.attack + attackDelta);
      stats.moveSpeed = Math.max(0.5, stats.moveSpeed * speedScale);
    }
  }
}
