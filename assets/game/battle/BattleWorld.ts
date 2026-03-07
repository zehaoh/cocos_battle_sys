import { World } from '../core/ecs/World';
import { MathUtil } from '../core/math/MathUtil';
import { ObjectPool } from '../core/pool/ObjectPool';
import { AggroTable } from './aggro/AggroTable';
import { BuffFactory } from './buff/BuffFactory';
import { BuffStackRule } from './buff/BuffStackRule';
import { CombatService } from './combat/CombatService';
import { BattleConfigService, type BattleConfig } from './config/BattleConfig';
import { BuffComponent } from './components/BuffComponent';
import { CombatComponent } from './components/CombatComponent';
import { ProjectileComponent, type ProjectileType } from './components/ProjectileComponent';
import { TransformComponent } from './components/TransformComponent';
import { ServerSync } from './network/ServerSync';
import { ProjectileBehaviorTree } from './projectile/ProjectileBehaviorTree';
import type { ProjectileConfig } from './projectile/Projectile';
import { BattleRecorder } from './replay/BattleRecorder';
import { TimerService } from './services/TimerService';
import { SkillExecutor } from './skill/SkillExecutor';
import { SkillGraph } from './skill/SkillGraph';

export class BattleWorld {
  public readonly world = new World();
  public readonly buffFactory = new BuffFactory();
  public readonly buffStackRule = new BuffStackRule('refresh');
  public readonly skillExecutor = new SkillExecutor();
  public readonly recorder = new BattleRecorder();
  public readonly projectileBT = new ProjectileBehaviorTree();
  public readonly config: BattleConfigService;
  public readonly timer = new TimerService();
  private readonly combatService = new CombatService();

  private readonly skills = new Map<string, SkillGraph>();
  private readonly aggroTables = new Map<number, AggroTable>();
  private readonly projectileConfigPool = new ObjectPool<ProjectileConfig>(() => ({
    ownerId: 0,
    targetId: 0,
    speed: 0,
    damage: 0,
  }), (obj) => {
    obj.ownerId = 0;
    obj.targetId = 0;
    obj.speed = 0;
    obj.damage = 0;
    obj.hitRadius = undefined;
    obj.projectileType = undefined;
    obj.pierceLeft = undefined;
    obj.splitCount = undefined;
    obj.bounceLeft = undefined;
  });

  private tick = 0;
  public readonly serverSync: ServerSync;

  constructor(config: Partial<BattleConfig> = {}) {
    this.config = new BattleConfigService(config);
    this.serverSync = new ServerSync(this.config.get('maxSnapshots'));
  }

  public update(dt: number): void {
    this.world.update(dt);
    this.timer.update(dt);
    this.tick += 1;

    for (const [, table] of this.aggroTables) {
      table.decay(dt * this.config.get('aggroDecayPerSecond'));
    }

    this.serverSync.pushSnapshot({
      tick: this.tick,
      state: {
        alive: this.aliveUnits(),
      },
    });
  }

  public registerSkill(skillId: string, graph: SkillGraph): void {
    this.skills.set(skillId, graph);
  }

  public castSkill(skillId: string, casterId: number, targetId: number | null): void {
    const graph = this.skills.get(skillId);
    if (!graph) return;
    this.skillExecutor.execute(graph, {
      casterId,
      targetId,
      world: this,
    });

    const payload = { tick: this.tick, skillId, casterId, targetId };
    this.recorder.record(this.tick, 'castSkill', payload);
    this.world.eventBus.emit('castSkill', payload);
  }

  public applyDamage(attackerId: number, defenderId: number, rawDamage: number): void {
    const defender = this.world.getEntity(defenderId);
    if (!defender) return;
    const combat = defender.get<CombatComponent>('Combat');
    if (!combat || !combat.alive) return;

    const damage = this.combatService.computeDamage(rawDamage, combat.defense);
    combat.hp -= damage;
    this.addThreat(defenderId, attackerId, damage);

    if (combat.hp <= 0) {
      combat.alive = false;
      combat.hp = 0;
      this.world.destroyEntity(defenderId);
      this.aggroTables.delete(defenderId);
      this.world.eventBus.emit('unitDead', { tick: this.tick, entityId: defenderId });
    }

    const payload = {
      tick: this.tick,
      attackerId,
      defenderId,
      damage,
      hpLeft: combat.hp,
    };

    this.recorder.record(this.tick, 'damage', payload);
    this.world.eventBus.emit('damage', payload);
  }

  public spawnProjectile(
    ownerId: number,
    targetId: number,
    speed: number,
    damage: number,
    projectileType: ProjectileType = 'homing',
  ): number {
    const cfg = this.projectileConfigPool.acquire();
    cfg.ownerId = ownerId;
    cfg.targetId = targetId;
    cfg.speed = speed;
    cfg.damage = damage;
    cfg.projectileType = projectileType;

    const projectileId = this.spawnProjectileByConfig(cfg);
    this.projectileConfigPool.release(cfg);
    return projectileId;
  }

  public spawnProjectileByConfig(config: ProjectileConfig): number {
    const owner = this.world.getEntity(config.ownerId);
    const ownerTransform = owner?.get<TransformComponent>('Transform');
    const target = this.world.getEntity(config.targetId);
    const targetTransform = target?.get<TransformComponent>('Transform');

    const projectile = this.world.createEntity();
    this.world.addComponent(projectile.id, new TransformComponent(ownerTransform?.x ?? 0, ownerTransform?.y ?? 0));

    const dir = targetTransform && ownerTransform
      ? MathUtil.normalize({ x: targetTransform.x - ownerTransform.x, y: targetTransform.y - ownerTransform.y })
      : { x: 1, y: 0 };

    const projectileType = config.projectileType ?? 'homing';
    this.world.addComponent(
      projectile.id,
      new ProjectileComponent(
        config.ownerId,
        config.targetId,
        config.speed,
        config.damage,
        config.hitRadius ?? 0.3,
        projectileType,
        config.pierceLeft ?? 0,
        config.splitCount ?? 0,
        config.bounceLeft ?? 0,
        dir.x,
        dir.y,
      ),
    );

    const payload = {
      tick: this.tick,
      projectileId: projectile.id,
      ownerId: config.ownerId,
      targetId: config.targetId,
      projectileType,
    };

    this.recorder.record(this.tick, 'projectileSpawn', payload);
    this.world.eventBus.emit('projectileSpawn', payload);

    return projectile.id;
  }

  public updateProjectileMotion(projectileId: number, dt: number): void {
    const projectile = this.world.getEntity(projectileId);
    if (!projectile) return;

    const pTransform = projectile.get<TransformComponent>('Transform');
    const pData = projectile.get<ProjectileComponent>('Projectile');
    if (!pTransform || !pData) return;

    const target = this.world.getEntity(pData.targetId);
    const tTransform = target?.get<TransformComponent>('Transform');

    if (pData.projectileType === 'homing' || pData.projectileType === 'bounce') {
      if (!target || !tTransform) {
        this.world.destroyEntity(projectileId);
        return;
      }

      const distance = MathUtil.distance(pTransform, tTransform);
      if (distance <= pData.hitRadius) {
        this.onProjectileHit(projectileId, pData.targetId);
        return;
      }

      const dir = MathUtil.normalize({ x: tTransform.x - pTransform.x, y: tTransform.y - pTransform.y });
      pTransform.x += dir.x * pData.speed * dt;
      pTransform.y += dir.y * pData.speed * dt;
      pData.dirX = dir.x;
      pData.dirY = dir.y;
      return;
    }

    pTransform.x += pData.dirX * pData.speed * dt;
    pTransform.y += pData.dirY * pData.speed * dt;

    const enemies = this.findEnemiesInRadius(pData.ownerId, pTransform.x, pTransform.y, pData.hitRadius);
    for (const enemyId of enemies) {
      if (pData.hitSet.has(enemyId)) continue;
      this.onProjectileHit(projectileId, enemyId);
      if (!this.world.getEntity(projectileId)) return;
      if (pData.projectileType === 'linear') return;
    }
  }

  public applyBuff(entityId: number, buffId: string): void {
    const entity = this.world.getEntity(entityId);
    const comp = entity?.get<BuffComponent>('Buff');
    if (!entity || !comp) return;

    const meta = this.buffFactory.create(buffId);
    const current = comp.buffs.get(buffId);
    const next = this.buffStackRule.apply(current, meta);
    comp.buffs.set(buffId, next);
    meta.onApply?.(this, entityId, next.stacks);

    const payload = { tick: this.tick, entityId, buffId, stacks: next.stacks };
    this.recorder.record(this.tick, 'buffApply', payload);
    this.world.eventBus.emit('buffApply', payload);
  }

  public addThreat(ownerId: number, sourceId: number, value: number): void {
    const table = this.ensureAggroTable(ownerId);
    table.addThreat(sourceId, value);
  }

  public setTaunt(ownerId: number, sourceId: number | null): void {
    this.ensureAggroTable(ownerId).setTaunt(sourceId);
  }

  public pickAggroTarget(ownerId: number): number | null {
    const table = this.aggroTables.get(ownerId);
    if (!table) return null;
    return table.pickTarget((entityId) => {
      const entity = this.world.getEntity(entityId);
      const combat = entity?.get<CombatComponent>('Combat');
      return Boolean(combat?.alive);
    });
  }

  private ensureAggroTable(ownerId: number): AggroTable {
    let table = this.aggroTables.get(ownerId);
    if (!table) {
      table = new AggroTable();
      this.aggroTables.set(ownerId, table);
    }
    return table;
  }

  private onProjectileHit(projectileId: number, targetId: number): void {
    const projectile = this.world.getEntity(projectileId);
    if (!projectile) return;

    const pData = projectile.get<ProjectileComponent>('Projectile');
    const pTransform = projectile.get<TransformComponent>('Transform');
    if (!pData || !pTransform) return;

    pData.hitSet.add(targetId);
    this.applyDamage(pData.ownerId, targetId, pData.damage);

    if (pData.projectileType === 'pierce' && pData.pierceLeft > 0) {
      pData.pierceLeft -= 1;
      return;
    }

    if (pData.projectileType === 'split' && pData.splitCount > 0) {
      pData.splitCount -= 1;
      for (const nextTargetId of this.findEnemiesInRadius(
        pData.ownerId,
        pTransform.x,
        pTransform.y,
        this.config.get('splitSearchRadius'),
      )) {
        if (nextTargetId === targetId) continue;
        this.spawnProjectileByConfig({
          ownerId: pData.ownerId,
          targetId: nextTargetId,
          speed: pData.speed,
          damage: Math.max(1, Math.floor(pData.damage * this.config.get('splitDamageScale'))),
          projectileType: 'homing',
          hitRadius: pData.hitRadius,
        });
      }
      this.world.destroyEntity(projectileId);
      return;
    }

    if (pData.projectileType === 'bounce' && pData.bounceLeft > 0) {
      const nextTargetId = this.findEnemiesInRadius(
        pData.ownerId,
        pTransform.x,
        pTransform.y,
        this.config.get('bounceSearchRadius'),
      ).find((enemyId) => !pData.hitSet.has(enemyId));

      if (nextTargetId !== undefined) {
        pData.targetId = nextTargetId;
        pData.bounceLeft -= 1;
        return;
      }
    }

    this.world.destroyEntity(projectileId);
  }

  private findEnemiesInRadius(ownerId: number, x: number, y: number, radius: number): number[] {
    const owner = this.world.getEntity(ownerId);
    const ownerCombat = owner?.get<CombatComponent>('Combat');
    if (!ownerCombat) return [];

    const radiusSq = radius * radius;
    const out: number[] = [];

    for (const entity of this.world.query(['Combat', 'Transform'])) {
      if (entity.id === ownerId) continue;
      const combat = entity.get<CombatComponent>('Combat');
      const transform = entity.get<TransformComponent>('Transform');
      if (!combat || !transform || !combat.alive) continue;
      if (combat.team === ownerCombat.team) continue;

      const dx = transform.x - x;
      const dy = transform.y - y;
      if (dx * dx + dy * dy <= radiusSq) {
        out.push(entity.id);
      }
    }

    return out;
  }

  private aliveUnits(): number {
    let count = 0;
    for (const entity of this.world.getEntities()) {
      const combat = entity.get<CombatComponent>('Combat');
      if (combat?.alive) count += 1;
    }
    return count;
  }
}
