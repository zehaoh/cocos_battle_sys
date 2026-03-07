import { DamageType } from '../DamageType';

export class ResistanceModifier {
  public static modify(damage: number, damageType: DamageType, physicalResist: number, magicResist: number): number {
    if (damageType === DamageType.True) return damage;

    const resist = damageType === DamageType.Physical ? physicalResist : magicResist;
    const clamped = Math.min(0.9, Math.max(-0.5, resist));
    return damage * (1 - clamped);
  }
}
