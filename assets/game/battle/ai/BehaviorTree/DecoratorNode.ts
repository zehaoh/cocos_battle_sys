import type { AIContext } from '../AIContext';
import { BehaviorNode, NodeStatus } from './BehaviorNode';

export class CooldownDecorator extends BehaviorNode {
  private lastTime = -Infinity;

  constructor(private readonly cooldown: number) {
    super();
  }

  public tick(ctx: AIContext): NodeStatus {
    if (this.children.length === 0) return NodeStatus.FAILURE;
    if (ctx.time - this.lastTime < this.cooldown) return NodeStatus.FAILURE;

    const result = this.children[0].tick(ctx);
    if (result === NodeStatus.SUCCESS) {
      this.lastTime = ctx.time;
    }
    return result;
  }
}
