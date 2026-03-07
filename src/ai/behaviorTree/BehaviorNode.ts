export enum NodeStatus {
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
  RUNNING = 'RUNNING',
}

export interface AIContext {
  entityId: number;
  targetId?: number;
  deltaTime: number;
}

export abstract class BehaviorNode {
  abstract tick(ctx: AIContext): NodeStatus;
}
