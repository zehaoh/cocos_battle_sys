import { BattleWorld } from '../BattleWorld';
import { DamageType } from '../combat/DamageType';
import type { DamageRequest } from '../combat/DamageRequest';
import { MoveComponent } from '../components/MoveComponent';
import { TargetComponent } from '../components/TargetComponent';
import type { CastSkillCommand, InputCommand, MoveCommand, TargetCommand } from '../input/InputCommand';
import type { NavMesh } from '../pathfinding/NavMesh';
import type { SpawnProjectileRequest } from '../projectile/Projectile';
import { ProjectileFactory } from '../projectile/ProjectileFactory';
import { SkillGraphRuntime } from '../skill/SkillGraphRuntime';
import { AISystem } from '../systems/AISystem';
import { AggroSystem } from '../systems/AggroSystem';
import { BuffSystem } from '../systems/BuffSystem';
import { CollisionSystem } from '../systems/CollisionSystem';
import { CombatSystem } from '../systems/CombatSystem';
import { DeathSystem } from '../systems/DeathSystem';
import { DropSystem } from '../systems/DropSystem';
import { InputSystem } from '../systems/InputSystem';
import { MovementSystem } from '../systems/MovementSystem';
import { PathfindingSystem } from '../pathfinding/PathfindingSystem';
import { ProjectileSystem } from '../systems/ProjectileSystem';
import { SkillSystem, type SkillCastRequest } from '../systems/SkillSystem';
import { StatSystem } from '../systems/StatSystem';
import { SummonSystem } from '../systems/SummonSystem';
import { SyncSystem } from '../systems/SyncSystem';
import { UnitSystem } from '../systems/UnitSystem';

export interface RuntimeOptions {
  navMesh?: NavMesh;
}

export class BattleRuntime {
  private readonly projectileFactory = new ProjectileFactory();
  private readonly skillGraphRuntime: SkillGraphRuntime;
  public readonly inputSystem = new InputSystem();

  constructor(public readonly battleWorld: BattleWorld) {
    this.skillGraphRuntime = new SkillGraphRuntime(battleWorld);
  }

  public installDefaultPipeline(options: RuntimeOptions = {}): void {
    const world = this.battleWorld.world;

    world.eventBus.on('inputCommand', (payload) => {
      const cmd = payload as InputCommand;
      if (cmd.type === 'CastSkill') {
        const cast = cmd as CastSkillCommand;
        world.eventBus.emit('startSkill', { casterId: cast.casterId, skillId: cast.skillId, targetId: cast.targetId });
      } else if (cmd.type === 'Move') {
        const moveCmd = cmd as MoveCommand;
        const entity = world.getEntity(moveCmd.entityId);
        const move = entity?.get<MoveComponent>('Move');
        if (move) {
          move.destinationX = moveCmd.x;
          move.destinationY = moveCmd.y;
          move.moving = true;
        }
      } else if (cmd.type === 'Target') {
        const targetCmd = cmd as TargetCommand;
        const entity = world.getEntity(targetCmd.entityId);
        const target = entity?.get<TargetComponent>('Target');
        if (target) target.targetId = targetCmd.targetId;
      }
    });

    world.eventBus.on('skillCastRequest', (payload) => {
      const req = payload as SkillCastRequest;
      world.eventBus.emit('startSkill', { casterId: req.casterId, skillId: req.skillId, targetId: req.targetId });
    });

    world.eventBus.on('startSkill', (payload) => {
      const req = payload as { casterId: number; skillId: string; targetId: number | null };
      this.skillGraphRuntime.startSkill(req);
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
      const req = payload as {
        casterId: number;
        targetId: number;
        skillId?: number;
        damage: number;
        damageType?: DamageType;
        critRate?: number;
        critMultiplier?: number;
      };

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

    world.eventBus.on('dropRequest', (payload) => {
      const req = payload as { entityId: number };
      const roll = req.entityId % 100;
      if (roll < 35) {
        world.eventBus.emit('dropSpawned', {
          ownerId: req.entityId,
          itemId: roll % 2 === 0 ? 'gold_coin' : 'potion_small',
        });
      }
    });

    world.eventBus.on('summonRequest', (payload) => {
      const req = payload as { summonerId: number; projectileId: number; targetId: number | null };
      this.projectileFactory.spawn(world, req.projectileId, req.summonerId, req.targetId);
    });

    if (options.navMesh) {
      world.registerSystem(new PathfindingSystem(options.navMesh));
    }

    world.registerSystem(this.inputSystem);
    world.registerSystem(new UnitSystem());
    world.registerSystem(new StatSystem());
    world.registerSystem(new MovementSystem());
    world.registerSystem(new AggroSystem(this.battleWorld));
    world.registerSystem(new BuffSystem(this.battleWorld.buffFactory));
    world.registerSystem(new AISystem());
    world.registerSystem(new SkillSystem());
    world.registerSystem(new SummonSystem());
    world.registerSystem(new CombatSystem());
    world.registerSystem(new ProjectileSystem());
    world.registerSystem(new CollisionSystem());
    world.registerSystem(new DeathSystem());
    world.registerSystem(new DropSystem());
    world.registerSystem(new SyncSystem(this.battleWorld.serverSync));
  }
}
