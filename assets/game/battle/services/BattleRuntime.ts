import { BattleWorld } from '../BattleWorld';
import type { NavMesh } from '../pathfinding/NavMesh';
import { AISystem } from '../systems/AISystem';
import { AggroSystem } from '../systems/AggroSystem';
import { BuffSystem } from '../systems/BuffSystem';
import { CombatSystem } from '../systems/CombatSystem';
import { MovementSystem } from '../systems/MovementSystem';
import { PathfindingSystem } from '../pathfinding/PathfindingSystem';
import { ProjectileSystem } from '../systems/ProjectileSystem';
import { SkillSystem } from '../systems/SkillSystem';
import { SyncSystem } from '../systems/SyncSystem';

export interface RuntimeOptions {
  navMesh?: NavMesh;
}

export class BattleRuntime {
  constructor(public readonly battleWorld: BattleWorld) {}

  public installDefaultPipeline(options: RuntimeOptions = {}): void {
    const world = this.battleWorld.world;

    if (options.navMesh) {
      world.registerSystem(new PathfindingSystem(options.navMesh));
    }

    world.registerSystem(new MovementSystem());
    world.registerSystem(new AggroSystem(this.battleWorld));
    world.registerSystem(new BuffSystem(this.battleWorld.buffFactory));
    world.registerSystem(new AISystem());
    world.registerSystem(new SkillSystem((skillId, casterId, targetId) => {
      this.battleWorld.castSkill(skillId, casterId, targetId);
    }));
    world.registerSystem(new CombatSystem((attackerId, defenderId, damage) => {
      this.battleWorld.applyDamage(attackerId, defenderId, damage);
    }));
    world.registerSystem(new ProjectileSystem((projectileId, dt) => {
      this.battleWorld.projectileBT.tick(this.battleWorld, projectileId, dt);
    }));
    world.registerSystem(new SyncSystem(this.battleWorld.serverSync));
  }
}
