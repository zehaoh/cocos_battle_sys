import { EngineEvent } from '../../core/event/EventTypes';
import { Vec2Util } from '../../core/math/Vec2';
import { TransformComponent } from '../../battle/components/TransformComponent';
import { BTAction } from './BTAction';
import { BTCondition } from './BTCondition';
import { BTSelector } from './BTSelector';
import { BTSequence } from './BTSequence';
import { NodeStatus } from './NodeStatus';
import { BehaviorTree } from './BehaviorTree';

export function createMonsterTree(): BehaviorTree {
  const hasTarget = new BTCondition((ctx) => ctx.targetId !== null);
  const inRange = new BTCondition((ctx) => {
    if (ctx.targetId == null) return false;
    const self = ctx.world.entityManager.get(ctx.selfId);
    const target = ctx.world.entityManager.get(ctx.targetId);
    const s = self?.getComponent<TransformComponent>('Transform');
    const t = target?.getComponent<TransformComponent>('Transform');
    if (!s || !t) return false;
    return Vec2Util.dist(s.position, t.position) < 1.6;
  });

  const chase = new BTAction((ctx) => {
    if (ctx.targetId == null) return NodeStatus.FAILURE;
    const self = ctx.world.entityManager.get(ctx.selfId);
    const target = ctx.world.entityManager.get(ctx.targetId);
    const s = self?.getComponent<TransformComponent>('Transform');
    const t = target?.getComponent<TransformComponent>('Transform');
    if (!s || !t) return NodeStatus.FAILURE;
    const dir = Vec2Util.norm(Vec2Util.sub(t.position, s.position));
    s.position = Vec2Util.add(s.position, Vec2Util.mul(dir, 0.8 * ctx.deltaTime));
    return NodeStatus.RUNNING;
  });

  const attack = new BTAction((ctx) => {
    if (ctx.targetId == null) return NodeStatus.FAILURE;
    ctx.world.eventBus.emit(EngineEvent.ATTACK, { attackerId: ctx.selfId, targetId: ctx.targetId });
    return NodeStatus.SUCCESS;
  });

  return new BehaviorTree(
    new BTSelector([
      new BTSequence([hasTarget, inRange, attack]),
      new BTSequence([hasTarget, chase]),
    ]),
  );
}
