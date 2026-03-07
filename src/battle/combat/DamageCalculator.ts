import type { DamageContext } from './DamageContext';
import type { DamageResult } from './DamageResult';

export class DamageCalculator {
  public static calculate(ctx: DamageContext): DamageResult {
    const raw = Math.max(1, ctx.baseDamage + ctx.attack);
    const reduced = Math.max(1, Math.floor(raw * (100 / (100 + ctx.defense))));
    const crit = Math.random() < ctx.critChance;
    const finalDamage = crit ? Math.floor(reduced * ctx.critMultiplier) : reduced;
    return { finalDamage, crit };
  }
}
