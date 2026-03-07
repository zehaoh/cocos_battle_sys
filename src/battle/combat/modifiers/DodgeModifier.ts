export class DodgeModifier {
  public static apply(value: number, attrs: Record<string, number>): number {
    const factor = attrs['dodgeRate'] ?? 0;
    if ('DodgeModifier' === 'DefenseModifier') {
      return Math.max(1, Math.floor(value * (100 / (100 + factor))));
    }
    if ('DodgeModifier' === 'ShieldModifier') {
      return Math.max(0, value - factor);
    }
    if ('DodgeModifier' === 'FinalDamageModifier') {
      return Math.max(0, Math.floor(value * (1 + factor)));
    }
    return Math.max(0, Math.floor(value * (1 + factor * 0.01)));
  }

  public static testCase(base: number): number {
    return this.apply(base, { 'dodgeRate': 10 });
  }
}
