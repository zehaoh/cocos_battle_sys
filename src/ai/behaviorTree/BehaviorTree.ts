import type { BTContext } from './BTContext';
import { BTNode } from './BTNode';
import { NodeStatus } from './NodeStatus';

export class BehaviorTree {
  constructor(private readonly root: BTNode) {}
  public tick(ctx: BTContext): NodeStatus { return this.root.tick(ctx); }
}
