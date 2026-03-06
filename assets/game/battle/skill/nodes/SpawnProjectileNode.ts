import type { SkillNode, SkillContext } from '../SkillNode';

export class SpawnProjectileNode implements SkillNode {
  constructor(
    public readonly id: string,
    private readonly speed: number,
    private readonly damage: number,
  ) {}

  public run(ctx: SkillContext): void {
    if (ctx.targetId === null) return;
    ctx.world.spawnProjectile(ctx.casterId, ctx.targetId, this.speed, this.damage);
  }
}
