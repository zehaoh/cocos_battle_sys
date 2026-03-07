import { BTNode } from './BTNode';
import type { BTContext } from './BTContext';
import { NodeStatus } from './NodeStatus';

export class BTCondition extends BTNode {
  constructor(private readonly fn: (ctx: BTContext) => boolean) { super(); }
  tick(ctx: BTContext): NodeStatus { return this.fn(ctx) ? NodeStatus.SUCCESS : NodeStatus.FAILURE; }
}
