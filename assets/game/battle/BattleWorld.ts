import { World } from '../core/ecs/World';
import { MathUtil } from '../core/math/MathUtil';
import { BuffFactory } from './buff/BuffFactory';
import { BuffStackRule } from './buff/BuffStackRule';
import { CombatComponent } from './components/CombatComponent';
import { BuffComponent } from './components/BuffComponent';
import { ProjectileComponent } from './components/ProjectileComponent';
import { TransformComponent } from './components/TransformComponent';
import { ServerSync } from './network/ServerSync';
import { ProjectileBehaviorTree } from './projectile/ProjectileBehaviorTree';
import { BattleRecorder } from './replay/BattleRecorder';
import { SkillExecutor } from './skill/SkillExecutor';
import { SkillGraph } from './skill/SkillGraph';

export class BattleWorld {
  public readonly world = new World();
  public readonly buffFactory = new BuffFactory();
  public readonly buffStackRule = new BuffStackRule('refresh');
  public readonly skillExecutor = new SkillExecutor();
  public readonly recorder = new BattleRecorder();
  public readonly serverSync = new ServerSync();
  public readonly projectileBT = new ProjectileBehaviorTree();

  private readonly skills = new Map<string, SkillGraph>();
  private tick = 0;

  public update(dt: number): void {
    this.world.update(dt);
    this.tick += 1;
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
    this.recorder.record(this.tick, 'castSkill', { skillId, casterId, targetId });
  }

  public applyDamage(attackerId: number, defenderId: number, rawDamage: number): void {
    const defender = this.world.getEntity(defenderId);
    if (!defender) return;
    const combat = defender.get<CombatComponent>('Combat');
    if (!combat || !combat.alive) return;

    const damage = Math.max(1, rawDamage - combat.defense);
    combat.hp -= damage;
    if (combat.hp <= 0) {
      combat.alive = false;
      combat.hp = 0;
      this.world.destroyEntity(defenderId);
    }

    this.recorder.record(this.tick, 'damage', {
      attackerId,
      defenderId,
      damage,
      hpLeft: combat.hp,
    });
  }

  public spawnProjectile(ownerId: number, targetId: number, speed: number, damage: number): number {
    const owner = this.world.getEntity(ownerId);
    const transform = owner?.get<TransformComponent>('Transform');
    const projectile = this.world.createEntity();
    this.world.addComponent(projectile.id, new TransformComponent(transform?.x ?? 0, transform?.y ?? 0));
    this.world.addComponent(projectile.id, new ProjectileComponent(ownerId, targetId, speed, damage));

    this.recorder.record(this.tick, 'projectileSpawn', {
      projectileId: projectile.id,
      ownerId,
      targetId,
    });

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
    if (!target || !tTransform) {
      this.world.destroyEntity(projectileId);
      return;
    }

    const distance = MathUtil.distance(pTransform, tTransform);
    if (distance <= pData.hitRadius) {
      this.applyDamage(pData.ownerId, pData.targetId, pData.damage);
      this.world.destroyEntity(projectileId);
      return;
    }

    const dir = MathUtil.normalize({ x: tTransform.x - pTransform.x, y: tTransform.y - pTransform.y });
    pTransform.x += dir.x * pData.speed * dt;
    pTransform.y += dir.y * pData.speed * dt;
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
    this.recorder.record(this.tick, 'buffApply', { entityId, buffId, stacks: next.stacks });
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
