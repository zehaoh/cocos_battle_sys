import type { SkillContext, SkillNode } from '../SkillNode';

export class CastNode implements SkillNode {
  constructor(public readonly id: string) {}

  public run(ctx: SkillContext): void {
    ctx.world.world.eventBus.emit('skillNodeCast', {
      casterId: ctx.casterId,
      targetId: ctx.targetId,
    });
  }
}
