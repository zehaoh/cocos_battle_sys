import { BaseSkillNode } from './BaseSkillNode';
import type { SkillContext } from '../SkillNode';
import type { SkillNodeData } from '../SkillGraph';

export class AddBuffNode extends BaseSkillNode {
  public execute(node: SkillNodeData, ctx: SkillContext): void {
    const buffId = this.stringParam(node, 'buffId');
    if (!buffId) return;

    const toTarget = this.boolParam(node, 'toTarget', true);
    const entityId = toTarget ? ctx.targetId : ctx.casterId;
    if (entityId === null) return;

    ctx.world.applyBuff(entityId, buffId);
  }
}
