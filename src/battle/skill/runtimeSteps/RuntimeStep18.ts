import type { SkillContext } from '../SkillRuntime';

export class RuntimeStep18 {
  public readonly name = 'RuntimeStep18';

  public execute(ctx: SkillContext, payload: Record<string, unknown>): void {
    const casterId = ctx.casterId;
    const targetId = ctx.targetId;
    const chance = Number(payload['chance'] ?? 1);
    const base = Number(payload['base'] ?? 18);

    if (Math.random() > chance) {
      ctx.world.eventBus.emit('SKILL_STEP_SKIP', { step: this.name, casterId, targetId });
      return;
    }

    const amount = Math.max(1, Math.floor(base + 18 * 0.25));
    ctx.world.eventBus.emit('SKILL_STEP_EXEC', {
      step: this.name,
      casterId,
      targetId,
      amount,
      skillId: ctx.graph.id,
      payload,
    });

    if (18 % 3 === 0) {
      ctx.world.eventBus.emit('ATTACK', { attackerId: casterId, targetId });
    }

    if (18 % 5 === 0) {
      ctx.world.eventBus.emit('BUFF_ADD', { targetId, sourceId: casterId, buffId: 'Poison' });
    }

    if (18 % 7 === 0) {
      ctx.world.eventBus.emit('PROJECTILE_SPAWN', { casterId, targetId, speed: 5 + 18 * 0.1, damage: amount });
    }
  }
}
