import type { Component } from '../../core/ecs/Component';
import type { BehaviorTree } from '../../ai/behaviorTree/BehaviorTree';

export class AIComponent implements Component {
  public readonly type = 'AI';
  constructor(public tree: BehaviorTree, public targetId: number | null = null) {}
}
