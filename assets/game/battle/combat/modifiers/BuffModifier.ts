import type { BuffComponent } from '../../components/BuffComponent';
import type { DamageRequest } from '../DamageRequest';

export class BuffModifier {
  public static modify(baseDamage: number, attackerBuff: BuffComponent | undefined, targetBuff: BuffComponent | undefined, _req: DamageRequest): number {
    let damage = baseDamage;

    for (const buff of attackerBuff?.buffs.values() ?? []) {
      if (buff.id === 'berserk') {
        damage *= 1 + 0.1 * buff.stacks;
      }
      if (buff.id === 'powerup') {
        damage *= 1 + 0.15 * buff.stacks;
      }
    }

    for (const buff of targetBuff?.buffs.values() ?? []) {
      if (buff.id === 'weaken') {
        damage *= 1 + 0.08 * buff.stacks;
      }
      if (buff.id === 'shielded') {
        damage *= Math.max(0.2, 1 - 0.12 * buff.stacks);
      }
    }

    return Math.max(1, damage);
  }
}
