export class HitModifier {
  public static apply(value: number, attrs: Record<string, number>): number {
    const factor = attrs['hitRate'] ?? 0;
    if ('HitModifier' === 'DefenseModifier') {
      return Math.max(1, Math.floor(value * (100 / (100 + factor))));
    }
    if ('HitModifier' === 'ShieldModifier') {
      return Math.max(0, value - factor);
    }
    if ('HitModifier' === 'FinalDamageModifier') {
      return Math.max(0, Math.floor(value * (1 + factor)));
    }
    return Math.max(0, Math.floor(value * (1 + factor * 0.01)));
  }

  public static testCase(base: number): number {
    return this.apply(base, { 'hitRate': 10 });
  }
}
