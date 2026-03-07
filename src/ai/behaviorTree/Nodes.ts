import { BehaviorNode, type AIContext, NodeStatus } from './BehaviorNode';

export class SelectorNode extends BehaviorNode {
  constructor(private readonly children: BehaviorNode[]) { super(); }
  tick(ctx: AIContext): NodeStatus {
    for (const child of this.children) {
      const result = child.tick(ctx);
      if (result !== NodeStatus.FAILURE) return result;
    }
    return NodeStatus.FAILURE;
  }
}

export class SequenceNode extends BehaviorNode {
  constructor(private readonly children: BehaviorNode[]) { super(); }
  tick(ctx: AIContext): NodeStatus {
    for (const child of this.children) {
      const result = child.tick(ctx);
      if (result !== NodeStatus.SUCCESS) return result;
    }
    return NodeStatus.SUCCESS;
  }
}

export class ConditionNode extends BehaviorNode {
  constructor(private readonly condition: (ctx: AIContext) => boolean) { super(); }
  tick(ctx: AIContext): NodeStatus { return this.condition(ctx) ? NodeStatus.SUCCESS : NodeStatus.FAILURE; }
}

export class ActionNode extends BehaviorNode {
  constructor(private readonly action: (ctx: AIContext) => NodeStatus) { super(); }
  tick(ctx: AIContext): NodeStatus { return this.action(ctx); }
}

export class DecoratorNode extends BehaviorNode {
  constructor(private readonly child: BehaviorNode, private readonly wrapper: (s: NodeStatus) => NodeStatus) { super(); }
  tick(ctx: AIContext): NodeStatus { return this.wrapper(this.child.tick(ctx)); }
}

export class ParallelNode extends BehaviorNode {
  constructor(private readonly children: BehaviorNode[]) { super(); }
  tick(ctx: AIContext): NodeStatus {
    let success = 0;
    for (const child of this.children) {
      const r = child.tick(ctx);
      if (r === NodeStatus.RUNNING) return NodeStatus.RUNNING;
      if (r === NodeStatus.SUCCESS) success += 1;
    }
    return success === this.children.length ? NodeStatus.SUCCESS : NodeStatus.FAILURE;
  }
}
