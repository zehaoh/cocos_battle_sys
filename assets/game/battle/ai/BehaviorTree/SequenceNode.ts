import type { AIContext } from '../AIContext';
import { BehaviorNode, NodeStatus } from './BehaviorNode';

export class SequenceNode extends BehaviorNode {
  public tick(ctx: AIContext): NodeStatus {
    for (const child of this.children) {
      const result = child.tick(ctx);
      if (result !== NodeStatus.SUCCESS) return result;
    }
    return NodeStatus.SUCCESS;
  }
}
