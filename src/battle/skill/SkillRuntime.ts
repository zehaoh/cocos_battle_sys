import { EngineEvent } from '../../core/event/EventTypes';
import type { SkillGraph } from './SkillGraph';
import { SkillNodeType } from './SkillNode';

export interface SkillContext {
  casterId: number;
  targetId: number;
  graph: SkillGraph;
  world: import('../../core/ecs/World').World;
}

export class SkillRuntime {
  public execute(ctx: SkillContext): void {
    const map = new Map(ctx.graph.nodes.map((n) => [n.id, n]));
    const queue = [ctx.graph.entry];
    while (queue.length) {
      const id = queue.shift()!;
      const node = map.get(id);
      if (!node) continue;
      switch (node.type) {
        case SkillNodeType.PlayAnimation:
          ctx.world.eventBus.emit('ANIM_PLAY', { entityId: ctx.casterId, state: 'Attack' });
          break;
        case SkillNodeType.SpawnHitbox:
          ctx.world.eventBus.emit(EngineEvent.ATTACK, { attackerId: ctx.casterId, targetId: ctx.targetId });
          break;
        case SkillNodeType.ApplyDamage:
          ctx.world.eventBus.emit(EngineEvent.ATTACK, { attackerId: ctx.casterId, targetId: ctx.targetId });
          break;
        case SkillNodeType.ApplyBuff:
          ctx.world.eventBus.emit(EngineEvent.BUFF_ADD, {
            targetId: ctx.targetId,
            buffId: String(node.params?.buffId ?? 'Poison'),
            sourceId: ctx.casterId,
          });
          break;
      }
      for (const next of node.next ?? []) queue.push(next);
    }
  }
}
