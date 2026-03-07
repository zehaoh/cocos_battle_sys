import { BattleWorld } from '../BattleWorld';
import { DamageType } from '../combat/DamageType';
import type { DamageRequest } from '../combat/DamageRequest';
import type { NavMesh } from '../pathfinding/NavMesh';
import type { SpawnProjectileRequest } from '../projectile/Projectile';
import { ProjectileFactory } from '../projectile/ProjectileFactory';
import { AISystem } from '../systems/AISystem';
import { AggroSystem } from '../systems/AggroSystem';
import { BuffSystem } from '../systems/BuffSystem';
import { CombatSystem } from '../systems/CombatSystem';
import { MovementSystem } from '../systems/MovementSystem';
import { PathfindingSystem } from '../pathfinding/PathfindingSystem';
import { ProjectileSystem, type ProjectileHitEvent } from '../systems/ProjectileSystem';
import { SkillSystem, type SkillCastRequest } from '../systems/SkillSystem';
import { SyncSystem } from '../systems/SyncSystem';

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
        targetId: req.targetId,
        skillId: req.skillId ?? 0,
        damage: req.damage,
        damageType: req.damageType ?? DamageType.Physical,
        critRate: req.critRate ?? 0,
        critMultiplier: req.critMultiplier ?? 1.5,
      } as DamageRequest);
    });

    world.eventBus.on('damageRequest', (payload) => {
      const req = payload as DamageRequest;
      this.battleWorld.applyDamage(req);
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
