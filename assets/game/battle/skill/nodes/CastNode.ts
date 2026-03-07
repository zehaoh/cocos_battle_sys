import { BaseSkillNode } from './BaseSkillNode';
import type { SkillContext, SkillNodeResult } from '../SkillNode';
import type { SkillNodeData } from '../SkillGraph';

export class CastNode extends BaseSkillNode {
  public execute(node: SkillNodeData, ctx: SkillContext): SkillNodeResult {
    ctx.world.world.eventBus.emit('skillNodeCast', {
      skillGraphId: ctx.graph.id,
      nodeId: node.id,
      casterId: ctx.casterId,
      targetId: ctx.targetId,
    });

    return {};
  }
}
