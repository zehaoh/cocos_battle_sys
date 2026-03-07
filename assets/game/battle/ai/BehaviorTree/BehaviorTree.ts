import type { AIContext } from '../AIContext';
import { BehaviorNode, NodeStatus } from './BehaviorNode';

export class BehaviorTree {
  constructor(private readonly root: BehaviorNode) {}

  public tick(ctx: AIContext): NodeStatus {
    return this.root.tick(ctx);
  }
}
