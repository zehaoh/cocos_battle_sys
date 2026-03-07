import type { BuffComponent } from '../components/BuffComponent';
import type { DamageRequest } from './DamageRequest';
import type { DamageResult } from './DamageResult';
import { BuffModifier } from './modifiers/BuffModifier';
import { CritModifier } from './modifiers/CritModifier';
import { DefenseModifier } from './modifiers/DefenseModifier';
import { ResistanceModifier } from './modifiers/ResistanceModifier';

export interface DamagePipelineContext {
  defense: number;
  physicalResist: number;
  magicResist: number;
  attackerBuff?: BuffComponent;
  targetBuff?: BuffComponent;
}

export class DamagePipeline {
  public static calculate(req: DamageRequest, ctx: DamagePipelineContext): DamageResult {
    let damage = req.damage;
    damage = BuffModifier.modify(damage, ctx.attackerBuff, ctx.targetBuff, req);
    damage = DefenseModifier.modify(damage, ctx.defense, req.damageType);
    damage = ResistanceModifier.modify(damage, req.damageType, ctx.physicalResist, ctx.magicResist);

    const crit = CritModifier.modify(damage, req.critRate, req.critMultiplier);
    return {
      finalDamage: Math.max(1, Math.floor(crit.damage)),
      isCrit: crit.isCrit,
      damageType: req.damageType,
    };
  }
}
