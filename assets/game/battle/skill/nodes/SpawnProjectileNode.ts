import { BaseSkillNode } from './BaseSkillNode';
import type { SkillContext } from '../SkillNode';
import type { SkillNodeData } from '../SkillGraph';

export class SpawnProjectileNode extends BaseSkillNode {
  public execute(node: SkillNodeData, ctx: SkillContext): void {
    const projectileId = this.numberParam(node, 'projectileId', 2001);

    ctx.world.world.eventBus.emit('spawnProjectileRequest', {
      projectileId,
      casterId: ctx.casterId,
      targetId: ctx.targetId,
    });
  }
}
