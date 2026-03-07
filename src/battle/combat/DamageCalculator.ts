import type { DamageContext } from './DamageContext';
import { DamageType } from './DamageType';

export interface DamagePipelineInput extends DamageContext {
  hitRate?: number;
  dodgeRate?: number;
  blockRate?: number;
  critRate?: number;
  critMultiplier?: number;
  resistance?: number;
  shield?: number;
}

export class DamageCalculator {
  public static calculate(input: DamagePipelineInput): number {
    let damage = input.baseDamage;

    // HitCheck
    if (Math.random() > (input.hitRate ?? 1)) return 0;
    // DodgeCheck
    if (Math.random() < (input.dodgeRate ?? 0)) return 0;
    // BlockCheck
    if (Math.random() < (input.blockRate ?? 0)) damage *= 0.5;
    // CritCheck
    if (Math.random() < (input.critRate ?? 0)) damage *= input.critMultiplier ?? 1.5;
    // Resistance
    if (input.damageType !== DamageType.True) damage *= Math.max(0, 1 - (input.resistance ?? 0));
    // Shield
    damage = Math.max(0, damage - (input.shield ?? 0));
    // FinalDamage
    return Math.floor(Math.max(0, damage));
  }
}
