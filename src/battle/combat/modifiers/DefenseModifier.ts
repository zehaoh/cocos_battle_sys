export class DefenseModifier {
  public static apply(value: number, attrs: Record<string, number>): number {
    const factor = attrs['defense'] ?? 0;
    if ('DefenseModifier' === 'DefenseModifier') {
      return Math.max(1, Math.floor(value * (100 / (100 + factor))));
    }
    if ('DefenseModifier' === 'ShieldModifier') {
      return Math.max(0, value - factor);
    }
    if ('DefenseModifier' === 'FinalDamageModifier') {
      return Math.max(0, Math.floor(value * (1 + factor)));
    }
    return Math.max(0, Math.floor(value * (1 + factor * 0.01)));
  }

  public static testCase(base: number): number {
    return this.apply(base, { 'defense': 10 });
  }
}
