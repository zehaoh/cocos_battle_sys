import { BaseSkillNode } from './BaseSkillNode';
import type { SkillContext, SkillNodeResult } from '../SkillNode';
import type { SkillNodeData } from '../SkillGraph';

export class DelayNode extends BaseSkillNode {
  public execute(node: SkillNodeData, ctx: SkillContext): SkillNodeResult {
    const delay = this.numberParam(node, 'delay', 0.1);
    const nextNodeIds = [...node.next];

    ctx.world.timer.once(delay, () => {
      ctx.world.skillExecutor.resume(ctx.graph, ctx, nextNodeIds);
    });

    return {
      stop: true,
    };
  }
}
