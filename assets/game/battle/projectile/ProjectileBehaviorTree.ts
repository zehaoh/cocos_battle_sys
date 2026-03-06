import type { BattleWorld } from '../BattleWorld';

export class ProjectileBehaviorTree {
  public tick(world: BattleWorld, projectileId: number, dt: number): void {
    world.updateProjectileMotion(projectileId, dt);
  }
}
