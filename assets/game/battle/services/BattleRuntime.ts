import { BattleWorld } from '../BattleWorld';
import type { NavMesh } from '../pathfinding/NavMesh';
import { ProjectileFactory } from '../projectile/ProjectileFactory';
import { AISystem } from '../systems/AISystem';
import { AggroSystem } from '../systems/AggroSystem';
import { BuffSystem } from '../systems/BuffSystem';
import { CombatSystem, type DamageRequest } from '../systems/CombatSystem';
import { MovementSystem } from '../systems/MovementSystem';
import { PathfindingSystem } from '../pathfinding/PathfindingSystem';
import { ProjectileSystem, type ProjectileHitEvent } from '../systems/ProjectileSystem';
import { SkillSystem, type SkillCastRequest } from '../systems/SkillSystem';
import { SyncSystem } from '../systems/SyncSystem';
import type { SpawnProjectileRequest } from '../projectile/Projectile';

export interface RuntimeOptions {
  navMesh?: NavMesh;
}

export class BattleRuntime {
  private readonly projectileFactory = new ProjectileFactory();

  constructor(public readonly battleWorld: BattleWorld) {}

  public installDefaultPipeline(options: RuntimeOptions = {}): void {
    const world = this.battleWorld.world;

    world.eventBus.on('skillCastRequest', (payload) => {
      const req = payload as SkillCastRequest;
      this.battleWorld.castSkill(req.skillId, req.casterId, req.targetId);
    });

    world.eventBus.on('spawnProjectileRequest', (payload) => {
      const req = payload as SpawnProjectileRequest;
      this.projectileFactory.spawn(world, req.projectileId, req.casterId, req.targetId);
    });

    world.eventBus.on('projectileSplit', (payload) => {
      const req = payload as { projectileId: number; casterId: number; fromTargetId: number; splitCount: number };
      for (let i = 0; i < req.splitCount; i++) {
        this.projectileFactory.spawn(world, req.projectileId, req.casterId, req.fromTargetId);
      }
    });

    world.eventBus.on('projectileHit', (payload) => {
      const req = payload as ProjectileHitEvent;
      world.eventBus.emit('damageRequest', {
        attackerId: req.casterId,
        defenderId: req.targetId,
        damage: req.damage,
      } as DamageRequest);
    });

    world.eventBus.on('damageRequest', (payload) => {
      const req = payload as DamageRequest;
      this.battleWorld.applyDamage(req.attackerId, req.defenderId, req.damage);
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
