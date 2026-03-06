import type { SkillNode, SkillContext } from '../SkillNode';

export class DamageNode implements SkillNode {
  constructor(
    public readonly id: string,
    private readonly amount: number,
  ) {}

  public run(ctx: SkillContext): void {
    if (ctx.targetId === null) return;
    ctx.world.applyDamage(ctx.casterId, ctx.targetId, this.amount);
  }
}
