import { DamageType } from '../DamageType';

export class DefenseModifier {
  public static modify(damage: number, defense: number, damageType: DamageType): number {
    if (damageType === DamageType.True) {
      return damage;
    }
    const safeDefense = Math.max(0, defense);
    return damage * (100 / (100 + safeDefense));
  }
}
