export interface CritResult {
  damage: number;
  isCrit: boolean;
}

export class CritModifier {
  public static modify(damage: number, critRate: number, critMultiplier: number): CritResult {
    const chance = Math.max(0, Math.min(1, critRate));
    const multi = Math.max(1, critMultiplier);
    const isCrit = Math.random() < chance;

    return {
      damage: isCrit ? damage * multi : damage,
      isCrit,
    };
  }
}
