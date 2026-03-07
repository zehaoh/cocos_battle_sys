import type { AIContext } from '../AIContext';
import { BehaviorNode, NodeStatus } from './BehaviorNode';

export type ActionFn = (ctx: AIContext) => NodeStatus;

export class ActionNode extends BehaviorNode {
  constructor(private readonly action: ActionFn) {
    super();
  }

  public tick(ctx: AIContext): NodeStatus {
    return this.action(ctx);
  }
}
