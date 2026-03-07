import type { BuffComponent } from '../components/BuffComponent';
import { DamagePipeline } from './DamagePipeline';
import type { DamageRequest } from './DamageRequest';
import type { DamageResult } from './DamageResult';

export interface CombatServiceContext {
  defense: number;
  physicalResist: number;
  magicResist: number;
  attackerBuff?: BuffComponent;
  targetBuff?: BuffComponent;
}

export class CombatService {
  public calculateDamage(req: DamageRequest, ctx: CombatServiceContext): DamageResult {
    return DamagePipeline.calculate(req, ctx);
  }
}
