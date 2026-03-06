import { System } from '../../core/ecs/System';
import type { World } from '../../core/ecs/World';
import { AIComponent } from '../components/AIComponent';
import { CombatComponent } from '../components/CombatComponent';
import { MoveComponent } from '../components/MoveComponent';
import { TargetComponent } from '../components/TargetComponent';
import { TransformComponent } from '../components/TransformComponent';

export class AISystem extends System {
  constructor() {
    super(25);
  }

  public update(world: World, dt: number): void {
    for (const entity of world.query(['AI', 'Combat', 'Move', 'Transform', 'Target'])) {
      const ai = entity.get<AIComponent>('AI') as AIComponent;
      const combat = entity.get<CombatComponent>('Combat') as CombatComponent;
      const move = entity.get<MoveComponent>('Move') as MoveComponent;
      const selfTransform = entity.get<TransformComponent>('Transform') as TransformComponent;
      const target = entity.get<TargetComponent>('Target') as TargetComponent;

      ai.thinkLeft -= dt;
      if (ai.thinkLeft > 0) continue;
      ai.thinkLeft = ai.thinkInterval;

      if (combat.hp / combat.maxHp < 0.2) {
        ai.state = 'Retreat';
      } else if (target.targetId === null) {
        ai.state = 'Idle';
      } else {
        const targetEntity = world.getEntity(target.targetId);
        const targetTransform = targetEntity?.get<TransformComponent>('Transform');
        if (!targetTransform) {
          target.targetId = null;
          ai.state = 'Idle';
          continue;
        }

        const dx = targetTransform.x - selfTransform.x;
        const dy = targetTransform.y - selfTransform.y;
        const distSq = dx * dx + dy * dy;
        ai.state = distSq <= combat.attackRange * combat.attackRange ? 'Attack' : 'Chase';

        if (ai.state === 'Chase') {
          move.destinationX = targetTransform.x;
          move.destinationY = targetTransform.y;
          move.moving = true;
        }
      }

      if (ai.state === 'Retreat') {
        move.destinationX = selfTransform.x - 2;
        move.destinationY = selfTransform.y - 2;
        move.moving = true;
      }
    }
  }
}
