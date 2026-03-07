import { System } from '../../core/ecs/System';
import type { World } from '../../core/ecs/World';
import { ConditionNode, SelectorNode, SequenceNode } from '../ai/BehaviorTree';
import { AIComponent } from '../components/AIComponent';
import { CombatComponent } from '../components/CombatComponent';
import { MoveComponent } from '../components/MoveComponent';
import { TargetComponent } from '../components/TargetComponent';
import { TransformComponent } from '../components/TransformComponent';

export class AISystem extends System {
  private readonly behaviorTree = new SelectorNode([
    new SequenceNode([
      new ConditionNode((ctx) => ctx.shouldRetreat),
      new ConditionNode(() => true),
    ]),
    new SequenceNode([
      new ConditionNode((ctx) => ctx.hasTarget),
      new ConditionNode((ctx) => ctx.canAttack),
    ]),
    new ConditionNode((ctx) => ctx.hasTarget),
  ]);

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

      const targetEntity = target.targetId !== null ? world.getEntity(target.targetId) : undefined;
      const targetTransform = targetEntity?.get<TransformComponent>('Transform');

      const hasTarget = Boolean(targetEntity && targetTransform);
      if (!hasTarget) target.targetId = null;

      const distSq = hasTarget
        ? (targetTransform!.x - selfTransform.x) ** 2 + (targetTransform!.y - selfTransform.y) ** 2
        : Number.POSITIVE_INFINITY;

      const ctx = {
        canAttack: distSq <= combat.attackRange * combat.attackRange,
        hasTarget,
        shouldRetreat: combat.hp / combat.maxHp < 0.2,
      };

      this.behaviorTree.evaluate(ctx);

      if (ctx.shouldRetreat) {
        ai.state = 'Retreat';
        move.destinationX = selfTransform.x - 2;
        move.destinationY = selfTransform.y - 2;
        move.moving = true;
        continue;
      }

      if (!ctx.hasTarget) {
        ai.state = 'Idle';
        move.moving = false;
        continue;
      }

      if (ctx.canAttack) {
        ai.state = 'Attack';
        move.moving = false;
      } else {
        ai.state = 'Chase';
        move.destinationX = targetTransform!.x;
        move.destinationY = targetTransform!.y;
        move.moving = true;
      }
    }
  }
}
