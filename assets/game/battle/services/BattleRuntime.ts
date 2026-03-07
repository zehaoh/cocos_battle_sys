import { BattleWorld } from '../BattleWorld';
import type { World } from '../../core/ecs/World';
import { DamageType } from '../combat/DamageType';
import type { DamageRequest } from '../combat/DamageRequest';
import { MoveComponent } from '../components/MoveComponent';
import { TargetComponent } from '../components/TargetComponent';
import type { CastSkillCommand, InputCommand, MoveCommand, TargetCommand } from '../input/InputCommand';
import type { NavMesh } from '../pathfinding/NavMesh';
import type { SpawnProjectileRequest } from '../projectile/Projectile';
import { ProjectileFactory } from '../projectile/ProjectileFactory';
import { SkillGraphRuntime } from '../skill/SkillGraphRuntime';
import { GridNav } from '../navigation/GridNav';
import { NavMesh as RuntimeNavMesh } from '../navigation/NavMesh';
import { NavSystem } from '../navigation/NavSystem';
import { Pathfinder } from '../navigation/Pathfinder';
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
import { AnimationEventSystem } from '../animation/AnimationEventSystem';
import { BattleSimulator } from '../simulation/BattleSimulator';
import type { Command } from '../simulation/CommandQueue';

export interface RuntimeOptions {
  navMesh?: NavMesh;
  gridNavSize?: { width: number; height: number };
}

export class BattleRuntime {
  private readonly projectileFactory = new ProjectileFactory();
  private readonly skillGraphRuntime: SkillGraphRuntime;
  public readonly inputSystem = new InputSystem();
  public readonly simulator: BattleSimulator;
  private fallbackGridNav = new GridNav(128, 128);

  constructor(public readonly battleWorld: BattleWorld) {
    this.skillGraphRuntime = new SkillGraphRuntime(battleWorld);
    this.simulator = new BattleSimulator(battleWorld.world);
  }

  public update(dt: number): void {
    this.simulator.update(dt);
    this.battleWorld.updatePostSimulation();
  }

  public installDefaultPipeline(options: RuntimeOptions = {}): void {
    const world = this.battleWorld.world;

    world.eventBus.on('executeCommand', (payload) => {
      this.applyCommand(world, payload as Command);
    });

    world.eventBus.on('inputCommand', (payload) => {
      const cmd = payload as InputCommand;
      const frame = this.simulator.getCurrentFrame() + 1;

      if (cmd.type === 'CastSkill') {
        const cast = cmd as CastSkillCommand;
        this.simulator.enqueue('CastSkill', cast.casterId, { skillId: cast.skillId, targetId: cast.targetId }, frame);
      } else if (cmd.type === 'Move') {
        const moveCmd = cmd as MoveCommand;
        this.simulator.enqueue('Move', moveCmd.entityId, { x: moveCmd.x, y: moveCmd.y }, frame);
      } else if (cmd.type === 'Target') {
        const targetCmd = cmd as TargetCommand;
        this.simulator.enqueue('Target', targetCmd.entityId, { targetId: targetCmd.targetId }, frame);
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

    if (options.gridNavSize) {
      this.fallbackGridNav = new GridNav(options.gridNavSize.width, options.gridNavSize.height);
    }

    const navigator = options.navMesh
      ? new RuntimeNavMesh(options.navMesh)
      : this.fallbackGridNav;

    world.registerSystem(new NavSystem(new Pathfinder(navigator)));

    if (options.navMesh) {
      world.registerSystem(new PathfindingSystem(options.navMesh));
    }

    world.registerSystem(this.inputSystem);
    world.registerSystem(new UnitSystem());
    world.registerSystem(new StatSystem());
    world.registerSystem(new MovementSystem());
    world.registerSystem(new AggroSystem());
    world.registerSystem(new BuffSystem(this.battleWorld.buffFactory, this.battleWorld));
    world.registerSystem(new AISystem());
    world.registerSystem(new SkillSystem());
    world.registerSystem(new SummonSystem());
    world.registerSystem(new AnimationEventSystem());
    world.registerSystem(new CombatSystem());
    world.registerSystem(new ProjectileSystem());
    world.registerSystem(new CollisionSystem());
    world.registerSystem(new DeathSystem());
    world.registerSystem(new DropSystem());
    world.registerSystem(new SyncSystem(this.battleWorld.serverSync));
  }

  private applyCommand(world: World, command: Command): void {
    if (command.type === 'CastSkill') {
      const skillId = command.params?.skillId;
      const targetId = command.params?.targetId;
      if (typeof skillId !== 'string') return;
      world.eventBus.emit('startSkill', {
        casterId: command.entity,
        skillId,
        targetId: typeof targetId === 'number' ? targetId : null,
      });
      return;
    }

    if (command.type === 'Move') {
      const x = command.params?.x;
      const y = command.params?.y;
      const entity = world.getEntity(command.entity);
      const move = entity?.get<MoveComponent>('Move');
      if (!move || typeof x !== 'number' || typeof y !== 'number') return;
      move.destinationX = x;
      move.destinationY = y;
      move.moving = true;
      return;
    }

    if (command.type === 'Target') {
      const targetId = command.params?.targetId;
      const entity = world.getEntity(command.entity);
      const target = entity?.get<TargetComponent>('Target');
      if (!target) return;
      target.targetId = typeof targetId === 'number' ? targetId : null;
    }
  }
}
