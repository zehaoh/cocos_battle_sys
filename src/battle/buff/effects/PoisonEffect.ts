import type { BuffInstance } from '../BuffInstance';
import { CombatSystem } from '../../combat/CombatSystem';

export function poisonTick(world: import('../../../core/ecs/World').World, ownerId: number, buff: BuffInstance): void {
  const combat = world.systems.find((s) => s instanceof CombatSystem) as CombatSystem | undefined;
  if (!combat) return;
  combat.applyDamage(buff.sourceId, ownerId, Math.max(1, Math.floor(buff.magnitude)), false);
}
