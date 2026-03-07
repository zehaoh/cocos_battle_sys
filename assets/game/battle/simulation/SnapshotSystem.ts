import type { World } from '../../core/ecs/World';
import { CombatComponent } from '../components/CombatComponent';
import { TransformComponent } from '../components/TransformComponent';
import type { BattleState } from './BattleState';

export class SnapshotSystem {
  private readonly snapshots = new Map<number, BattleState>();

  public snapshot(world: World, frame: number): void {
    const units: BattleState['units'] = [];
    for (const entity of world.getEntities()) {
      const combat = entity.get<CombatComponent>('Combat');
      const transform = entity.get<TransformComponent>('Transform');
      if (!combat && !transform) continue;
      units.push({
        id: entity.id,
        alive: combat?.alive ?? true,
        hp: combat?.hp,
        x: transform?.x,
        y: transform?.y,
      });
    }

    this.snapshots.set(frame, { frame, units });
  }

  public getSnapshot(frame: number): BattleState | undefined {
    return this.snapshots.get(frame);
  }

  public clear(): void {
    this.snapshots.clear();
  }
}
