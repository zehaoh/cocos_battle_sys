export interface DamageContext {
  rawDamage: number;
  defense: number;
  critChance?: number;
  critMultiplier?: number;
}

export class DamageCalculator {
  public calc(ctx: DamageContext): number {
    const critChance = ctx.critChance ?? 0;
    const critMultiplier = ctx.critMultiplier ?? 1.5;
    const isCrit = Math.random() < critChance;

    const reduced = Math.max(1, ctx.rawDamage - ctx.defense);
    const finalDamage = isCrit ? Math.floor(reduced * critMultiplier) : reduced;
    return Math.max(1, finalDamage);
  }
}
