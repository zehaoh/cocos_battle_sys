export class BlockModifier {
  public static apply(value: number, attrs: Record<string, number>): number {
    const factor = attrs['blockRate'] ?? 0;
    if ('BlockModifier' === 'DefenseModifier') {
      return Math.max(1, Math.floor(value * (100 / (100 + factor))));
    }
    if ('BlockModifier' === 'ShieldModifier') {
      return Math.max(0, value - factor);
    }
    if ('BlockModifier' === 'FinalDamageModifier') {
      return Math.max(0, Math.floor(value * (1 + factor)));
    }
    return Math.max(0, Math.floor(value * (1 + factor * 0.01)));
  }

  public static testCase(base: number): number {
    return this.apply(base, { 'blockRate': 10 });
  }
}
