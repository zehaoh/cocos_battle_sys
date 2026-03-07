import type { DamageType } from './DamageType';

export interface DamageRequest {
  attackerId: number;
  targetId: number;
  skillId?: number;
  damage: number;
  damageType: DamageType;
  critRate: number;
  critMultiplier: number;
}
