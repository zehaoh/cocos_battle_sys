import { BTNode } from './BTNode';
import type { BTContext } from './BTContext';
import { NodeStatus } from './NodeStatus';

export class BTDecorator extends BTNode {
  constructor(private readonly child: BTNode, private readonly wrap: (s: NodeStatus) => NodeStatus) { super(); }
  tick(ctx: BTContext): NodeStatus { return this.wrap(this.child.tick(ctx)); }
}
