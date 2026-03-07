import { BaseSkillNode } from './BaseSkillNode';
import { DamageType } from '../../combat/DamageType';
import type { SkillContext } from '../SkillNode';
import type { SkillNodeData } from '../SkillGraph';

export class DamageNode extends BaseSkillNode {
  public execute(node: SkillNodeData, ctx: SkillContext): void {
    if (ctx.targetId === null) return;

    const baseDamage = this.numberParam(node, 'damage', 10);
    const ratio = this.numberParam(node, 'ratio', 1);
    const finalDamage = Math.max(1, Math.floor(baseDamage * ratio));

    ctx.world.applyDamage({
      attackerId: ctx.casterId,
      targetId: ctx.targetId,
      skillId: ctx.graph.id,
      damage: finalDamage,
      damageType: DamageType.Magical,
      critRate: 0.15,
      critMultiplier: 1.6,
    });
  }
}
