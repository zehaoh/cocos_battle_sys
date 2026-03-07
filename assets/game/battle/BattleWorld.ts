import { World } from '../core/ecs/World';
import { AggroTable } from './aggro/AggroTable';
import { BuffFactory } from './buff/BuffFactory';
import { BuffStackRule } from './buff/BuffStackRule';
import { CombatService } from './combat/CombatService';
import { BattleConfigService, type BattleConfig } from './config/BattleConfig';
import { BuffComponent } from './components/BuffComponent';
import { CombatComponent } from './components/CombatComponent';
import { ServerSync } from './network/ServerSync';
import { BattleRecorder } from './replay/BattleRecorder';
import { TimerService } from './services/TimerService';
import { SkillExecutor } from './skill/SkillExecutor';
import type { SkillGraph } from './skill/SkillGraph';

export class BattleWorld {
  public readonly world = new World();
  public readonly buffFactory = new BuffFactory();
  public readonly buffStackRule = new BuffStackRule('refresh');
  public readonly skillExecutor = new SkillExecutor();
  public readonly recorder = new BattleRecorder();
  public readonly config: BattleConfigService;
  public readonly timer = new TimerService();
  private readonly combatService = new CombatService();

  private readonly skills = new Map<string, SkillGraph>();
  private readonly aggroTables = new Map<number, AggroTable>();

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

  private aliveUnits(): number {
    let count = 0;
    for (const entity of this.world.getEntities()) {
      const combat = entity.get<CombatComponent>('Combat');
      if (combat?.alive) count += 1;
    }
    return count;
  }
}
