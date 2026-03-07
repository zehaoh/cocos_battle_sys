import type { SkillContext, SkillNode } from '../SkillNode';

export class AddBuffNode implements SkillNode {
  constructor(
    public readonly id: string,
    private readonly buffId: string,
    private readonly toTarget = true,
  ) {}

  public run(ctx: SkillContext): void {
    const entityId = this.toTarget ? ctx.targetId : ctx.casterId;
    if (entityId === null) return;
    ctx.world.applyBuff(entityId, this.buffId);
  }
}
