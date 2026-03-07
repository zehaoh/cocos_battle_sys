import { BaseSkillNode } from './BaseSkillNode';
import type { SkillContext, SkillNodeResult } from '../SkillNode';
import type { SkillNodeData } from '../SkillGraph';

export class ConditionNode extends BaseSkillNode {
  public execute(node: SkillNodeData, ctx: SkillContext): SkillNodeResult {
    const requireTarget = this.boolParam(node, 'requireTarget', true);
    const hasTarget = ctx.targetId !== null;

    if (node.next.length === 0) return {};

    if ((requireTarget && hasTarget) || (!requireTarget && !hasTarget)) {
      return {
        nextNodeIds: [node.next[0]],
      };
    }

    if (node.next.length > 1) {
      return {
        nextNodeIds: [node.next[1]],
      };
    }

    return {
      nextNodeIds: [],
    };
  }
}
