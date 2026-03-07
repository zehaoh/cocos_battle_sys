import { System } from '../../core/ecs/System';
import type { World } from '../../core/ecs/World';
import { AIComponent } from '../components/AIComponent';
import { CombatComponent } from '../components/CombatComponent';
import { MoveComponent } from '../components/MoveComponent';
import { TargetComponent } from '../components/TargetComponent';
import { TransformComponent } from '../components/TransformComponent';
import { Blackboard } from '../ai/Blackboard';
import type { AIContext } from '../ai/AIContext';
import { BehaviorTreeLoader } from '../ai/BehaviorTreeLoader';
import type { BehaviorTree } from '../ai/BehaviorTree/BehaviorTree';

export class AISystem extends System {
  private readonly trees = new Map<number, BehaviorTree>();
  private readonly blackboards = new Map<number, Blackboard>();

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

      const blackboard = this.ensureBlackboard(entity.id);
      if (targetTransform) {
        blackboard.set('targetPos', { x: targetTransform.x, y: targetTransform.y });
      }

      const ctx: AIContext = {
        world,
        entityId: entity.id,
        targetId: target.targetId,
        position: { x: selfTransform.x, y: selfTransform.y },
        time: Date.now() / 1000,
        blackboard,
        canAttack: distSq <= combat.attackRange * combat.attackRange,
        hasTarget,
        shouldRetreat: combat.hp / combat.maxHp < 0.2,
        setState: (state) => {
          ai.state = state;
          if (state === 'Attack' || state === 'Idle') {
            move.moving = false;
          }
        },
        setMoveTarget: (x, y) => {
          move.destinationX = x;
          move.destinationY = y;
          move.moving = true;
        },
      };

      const tree = this.ensureTree(entity.id);
      tree.tick(ctx);
    }
  }

  private ensureBlackboard(entityId: number): Blackboard {
    let bb = this.blackboards.get(entityId);
    if (!bb) {
      bb = new Blackboard();
      this.blackboards.set(entityId, bb);
    }
    return bb;
  }

  private ensureTree(entityId: number): BehaviorTree {
    let tree = this.trees.get(entityId);
    if (!tree) {
      tree = BehaviorTreeLoader.fromJSON({
        type: 'Selector',
        children: [
          {
            type: 'Sequence',
            children: [
              { type: 'Condition', name: 'ShouldRetreat' },
              { type: 'Action', name: 'Retreat' },
            ],
          },
          {
            type: 'Sequence',
            children: [
              { type: 'Condition', name: 'TargetInRange' },
              { type: 'Decorator', cooldown: 0.2, children: [{ type: 'Action', name: 'Attack' }] },
            ],
          },
          {
            type: 'Sequence',
            children: [
              { type: 'Condition', name: 'HasTarget' },
              { type: 'Action', name: 'Chase' },
            ],
          },
          { type: 'Action', name: 'Idle' },
        ],
      });
      this.trees.set(entityId, tree);
    }
    return tree;
  }
}
