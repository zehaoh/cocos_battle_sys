import type { AIContext } from '../AIContext';
import { BehaviorNode, NodeStatus } from './BehaviorNode';

export type ConditionFn = (ctx: AIContext) => boolean;

export class ConditionNode extends BehaviorNode {
  constructor(private readonly condition: ConditionFn) {
    super();
  }

  public tick(ctx: AIContext): NodeStatus {
    return this.condition(ctx) ? NodeStatus.SUCCESS : NodeStatus.FAILURE;
  }
}
