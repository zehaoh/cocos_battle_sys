export interface BehaviorContext {
  canAttack: boolean;
  hasTarget: boolean;
  shouldRetreat: boolean;
}

export interface BehaviorNode {
  evaluate(ctx: BehaviorContext): boolean;
}

export class ConditionNode implements BehaviorNode {
  constructor(private readonly test: (ctx: BehaviorContext) => boolean) {}

  public evaluate(ctx: BehaviorContext): boolean {
    return this.test(ctx);
  }
}

export class SelectorNode implements BehaviorNode {
  constructor(private readonly children: BehaviorNode[]) {}

  public evaluate(ctx: BehaviorContext): boolean {
    for (const child of this.children) {
      if (child.evaluate(ctx)) return true;
    }
    return false;
  }
}

export class SequenceNode implements BehaviorNode {
  constructor(private readonly children: BehaviorNode[]) {}

  public evaluate(ctx: BehaviorContext): boolean {
    for (const child of this.children) {
      if (!child.evaluate(ctx)) return false;
    }
    return true;
  }
}
