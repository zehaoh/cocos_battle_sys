import type { SkillContext } from '../SkillRuntime';

export class SpawnHitboxNode {
  public readonly type = 'SpawnHitbox';

  public execute(ctx: SkillContext, params: Record<string, unknown>): void {
    const payload = {
      casterId: ctx.casterId,
      targetId: ctx.targetId,
      skillId: ctx.graph.id,
      node: this.type,
      params,
    };

    if (this.type === 'PlayAnimation') {
      ctx.world.eventBus.emit('ANIM_PLAY', { entityId: ctx.casterId, state: 'Attack' });
    } else if (this.type === 'ApplyDamage' || this.type === 'SpawnHitbox') {
      ctx.world.eventBus.emit('ATTACK', { attackerId: ctx.casterId, targetId: ctx.targetId });
    } else if (this.type === 'ApplyBuff') {
      ctx.world.eventBus.emit('BUFF_ADD', { targetId: ctx.targetId, sourceId: ctx.casterId, buffId: String(params['buffId'] ?? 'Poison') });
    } else if (this.type === 'Heal') {
      ctx.world.eventBus.emit('HEAL', { targetId: ctx.casterId, sourceId: ctx.casterId, amount: Number(params['amount'] ?? 1) });
    } else if (this.type === 'SpawnProjectile') {
      ctx.world.eventBus.emit('PROJECTILE_SPAWN', { casterId: ctx.casterId, targetId: ctx.targetId, speed: Number(params['speed'] ?? 6), damage: Number(params['damage'] ?? 6) });
    } else {
      ctx.world.eventBus.emit('SKILL_NODE_EXEC', payload);
    }
  }
}
