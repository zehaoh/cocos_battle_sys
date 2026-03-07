import type { DamageType } from './DamageType';

export interface DamageResult {
  finalDamage: number;
  isCrit: boolean;
  damageType: DamageType;
}
