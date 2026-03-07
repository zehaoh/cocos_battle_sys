import { BaseSkillNode } from './BaseSkillNode';
import type { ProjectileType } from '../../components/ProjectileComponent';
import type { SkillContext } from '../SkillNode';
import type { SkillNodeData } from '../SkillGraph';

export class SpawnProjectileNode extends BaseSkillNode {
  public execute(node: SkillNodeData, ctx: SkillContext): void {
    if (ctx.targetId === null) return;

    const speed = this.numberParam(node, 'speed', 8);
    const damage = this.numberParam(node, 'damage', 10);
    const projectileType = this.stringParam(node, 'projectileType', 'homing');

    ctx.world.spawnProjectile(
      ctx.casterId,
      ctx.targetId,
      speed,
      damage,
      projectileType as ProjectileType,
    );
  }
}
