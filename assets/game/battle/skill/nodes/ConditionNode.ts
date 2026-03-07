import { BaseSkillNode } from './BaseSkillNode';
import type { SkillContext, SkillNodeResult } from '../SkillNode';
import { SkillGraphUtil } from '../SkillGraph';
import type { SkillNodeData } from '../SkillGraph';

export class ConditionNode extends BaseSkillNode {
  public execute(node: SkillNodeData, ctx: SkillContext): SkillNodeResult {
    const requireTarget = this.boolParam(node, 'requireTarget', true);
    const hasTarget = ctx.targetId !== null;

    const next = SkillGraphUtil.nextNodeIds(ctx.graph, node.id);
    if (next.length === 0) return {};

    if ((requireTarget && hasTarget) || (!requireTarget && !hasTarget)) {
      return {
        nextNodeIds: [next[0]],
      };
    }

    if (next.length > 1) {
      return {
        nextNodeIds: [next[1]],
      };
    }

    return {
      nextNodeIds: [],
    };
  }
}
