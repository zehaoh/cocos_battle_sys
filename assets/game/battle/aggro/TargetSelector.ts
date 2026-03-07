import type { World } from '../../core/ecs/World';
import { CombatComponent } from '../components/CombatComponent';
import { ThreatComponent } from '../components/ThreatComponent';

export class TargetSelector {
  public selectTarget(world: World, ownerId: number, threat: ThreatComponent): number | null {
    return threat.table.getHighest((entityId) => this.isValidEnemy(world, ownerId, entityId));
  }

  private isValidEnemy(world: World, ownerId: number, targetId: number): boolean {
    const owner = world.getEntity(ownerId);
    const target = world.getEntity(targetId);
    const ownerCombat = owner?.get<CombatComponent>('Combat');
    const targetCombat = target?.get<CombatComponent>('Combat');
    if (!ownerCombat || !targetCombat) return false;
    return ownerCombat.team !== targetCombat.team && targetCombat.alive;
  }
}
