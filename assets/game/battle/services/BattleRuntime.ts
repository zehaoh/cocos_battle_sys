import { BattleWorld } from '../BattleWorld';
import type { NavMesh } from '../pathfinding/NavMesh';
import { AISystem } from '../systems/AISystem';
import { AggroSystem } from '../systems/AggroSystem';
import { BuffSystem } from '../systems/BuffSystem';
import { CombatSystem, type DamageRequest } from '../systems/CombatSystem';
import { MovementSystem } from '../systems/MovementSystem';
import { PathfindingSystem } from '../pathfinding/PathfindingSystem';
import { ProjectileSystem, type ProjectileStepRequest } from '../systems/ProjectileSystem';
import { SkillSystem, type SkillCastRequest } from '../systems/SkillSystem';
import { SyncSystem } from '../systems/SyncSystem';

export interface RuntimeOptions {
  navMesh?: NavMesh;
}

export class BattleRuntime {
  constructor(public readonly battleWorld: BattleWorld) {}

  public installDefaultPipeline(options: RuntimeOptions = {}): void {
    const world = this.battleWorld.world;

    world.eventBus.on('skillCastRequest', (payload) => {
      const req = payload as SkillCastRequest;
      this.battleWorld.castSkill(req.skillId, req.casterId, req.targetId);
    });

    world.eventBus.on('damageRequest', (payload) => {
      const req = payload as DamageRequest;
      this.battleWorld.applyDamage(req.attackerId, req.defenderId, req.damage);
    });

    world.eventBus.on('projectileStepRequest', (payload) => {
      const req = payload as ProjectileStepRequest;
      this.battleWorld.projectileBT.tick(this.battleWorld, req.projectileId, req.dt);
    });

    if (options.navMesh) {
      world.registerSystem(new PathfindingSystem(options.navMesh));
    }

    world.registerSystem(new MovementSystem());
    world.registerSystem(new AggroSystem(this.battleWorld));
    world.registerSystem(new BuffSystem(this.battleWorld.buffFactory));
    world.registerSystem(new AISystem());
    world.registerSystem(new SkillSystem());
    world.registerSystem(new CombatSystem());
    world.registerSystem(new ProjectileSystem());
    world.registerSystem(new SyncSystem(this.battleWorld.serverSync));
  }
}
