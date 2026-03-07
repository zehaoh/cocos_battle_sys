import type { AIContext } from '../AIContext';

export enum NodeStatus {
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
  RUNNING = 'RUNNING',
}

export abstract class BehaviorNode {
  protected readonly children: BehaviorNode[] = [];

  public addChild(node: BehaviorNode): this {
    this.children.push(node);
    return this;
  }

  public abstract tick(ctx: AIContext): NodeStatus;
}
