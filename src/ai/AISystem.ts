import { System } from '../core/ecs/System';
import type { World } from '../core/ecs/World';
import { SystemPriority } from '../core/ecs/SystemPriority';
import type { BehaviorNode } from './behaviorTree/BehaviorNode';

export interface AIComponent {
  tree: BehaviorNode;
  targetId?: number;
}

export class AISystem extends System {
  constructor() {
    super(SystemPriority.AI);
  }

  public update(world: World, dt: number): void {
    for (const entity of world.query(['AIComponent'])) {
      const ai = entity.get<AIComponent>('AIComponent');
      if (!ai) continue;
      ai.tree.tick({ entityId: entity.id, targetId: ai.targetId, deltaTime: dt });
    }
  }
}
