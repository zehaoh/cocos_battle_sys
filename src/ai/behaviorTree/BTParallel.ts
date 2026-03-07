import { BTNode } from './BTNode';
import type { BTContext } from './BTContext';
import { NodeStatus } from './NodeStatus';

export class BTParallel extends BTNode {
  constructor(private readonly children: BTNode[]) { super(); }
  tick(ctx: BTContext): NodeStatus {
    let success = 0;
    for (const child of this.children) {
      const status = child.tick(ctx);
      if (status === NodeStatus.RUNNING) return NodeStatus.RUNNING;
      if (status === NodeStatus.SUCCESS) success += 1;
    }
    return success === this.children.length ? NodeStatus.SUCCESS : NodeStatus.FAILURE;
  }
}
