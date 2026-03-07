import { BTNode } from './BTNode';
import type { BTContext } from './BTContext';
import { NodeStatus } from './NodeStatus';

export class BTAction extends BTNode {
  constructor(private readonly fn: (ctx: BTContext) => NodeStatus) { super(); }
  tick(ctx: BTContext): NodeStatus { return this.fn(ctx); }
}
