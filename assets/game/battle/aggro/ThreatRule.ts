export class ThreatRule {
  public constructor(
    public readonly damageFactor = 1,
    public readonly healFactor = 0.5,
    public readonly buffFactor = 0.25,
    public readonly defaultTauntValue = 200,
  ) {}

  public fromDamage(damage: number): number {
    return Math.max(0, damage) * this.damageFactor;
  }

  public fromHeal(heal: number): number {
    return Math.max(0, heal) * this.healFactor;
  }

  public fromBuff(weight: number): number {
    return Math.max(0, weight) * this.buffFactor;
  }

  public fromTaunt(value?: number): number {
    return Math.max(0, value ?? this.defaultTauntValue);
  }
}
