import { BaseSkillNode } from './BaseSkillNode';
import type { SkillContext } from '../SkillNode';
import type { SkillNodeData } from '../SkillGraph';

export class DamageNode extends BaseSkillNode {
  public execute(node: SkillNodeData, ctx: SkillContext): void {
    if (ctx.targetId === null) return;

    const baseDamage = this.numberParam(node, 'damage', 10);
    const ratio = this.numberParam(node, 'ratio', 1);
    const finalDamage = Math.max(1, Math.floor(baseDamage * ratio));

    ctx.world.applyDamage(ctx.casterId, ctx.targetId, finalDamage);
  }
}
