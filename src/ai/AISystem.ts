import { System } from '../core/ecs/System';
import { SystemPriority } from '../core/ecs/SystemPriority';
import { AIComponent } from '../battle/components/AIComponent';

export class AISystem extends System {
  constructor() { super(SystemPriority.AI); }

  public update(dt: number): void {
    for (const entity of this.world.query(['AI'])) {
      const ai = entity.getComponent<AIComponent>('AI');
      if (!ai || !ai.tree) continue;
      ai.tree.tick({ selfId: entity.id, targetId: ai.targetId, world: this.world, deltaTime: dt });
    }
  }
}
