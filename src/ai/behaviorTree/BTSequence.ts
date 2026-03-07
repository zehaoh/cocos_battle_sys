import { BTNode } from './BTNode';
import type { BTContext } from './BTContext';
import { NodeStatus } from './NodeStatus';

export class BTSequence extends BTNode {
  constructor(private readonly children: BTNode[]) { super(); }
  tick(ctx: BTContext): NodeStatus {
    for (const child of this.children) {
      const status = child.tick(ctx);
      if (status !== NodeStatus.SUCCESS) return status;
    }
    return NodeStatus.SUCCESS;
  }
}
