import { World } from '../core/ecs/World';
import { BuffFactory } from './buff/BuffFactory';
import { BuffStackRule } from './buff/BuffStackRule';
import { CombatService } from './combat/CombatService';
import type { DamageRequest } from './combat/DamageRequest';
import { DamageType } from './combat/DamageType';
import { BattleConfigService, type BattleConfig } from './config/BattleConfig';
import { BuffComponent } from './components/BuffComponent';
import { CombatComponent } from './components/CombatComponent';
import { ServerSync } from './network/ServerSync';
import { BattleRecorder } from './replay/BattleRecorder';
import { TimerService } from './services/TimerService';
import { SkillExecutor } from './skill/SkillExecutor';
import type { SkillGraph } from './skill/SkillGraph';
import { SkillGraphLoader } from './skill/SkillGraphLoader';

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
  private readonly skillGraphLoader = new SkillGraphLoader();

  private tick = 0;
  public readonly serverSync: ServerSync;

  constructor(config: Partial<BattleConfig> = {}) {
    this.config = new BattleConfigService(config);
    this.serverSync = new ServerSync(this.config.get('maxSnapshots'));
  }

  public update(dt: number): void {
    this.world.update(dt);
    this.updatePostSimulation();
  }

  public updatePostSimulation(): void {
    this.timer.update(1 / 30);
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

  public loadSkillGraphJSON(skillId: string, graphJSON: string): void {
    const graph = this.skillGraphLoader.loadFromJSON(graphJSON);
    this.registerSkill(skillId, graph);
  }

  public getSkillGraph(skillId: string): SkillGraph | undefined {
    return this.skills.get(skillId);
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

  public applyDamage(req: DamageRequest): void {
    const attacker = this.world.getEntity(req.attackerId);
    const defender = this.world.getEntity(req.targetId);
    if (!defender) return;

    const targetCombat = defender.get<CombatComponent>('Combat');
    if (!targetCombat || !targetCombat.alive) return;

    const attackerBuff = attacker?.get<BuffComponent>('Buff');
    const targetBuff = defender.get<BuffComponent>('Buff');

    const result = this.combatService.calculateDamage(req, {
      defense: targetCombat.defense,
      physicalResist: targetCombat.physicalResist,
      magicResist: targetCombat.magicResist,
      attackerBuff,
      targetBuff,
    });

    targetCombat.hp -= result.finalDamage;

    if (targetCombat.hp <= 0) {
      targetCombat.alive = false;
      targetCombat.hp = 0;
      this.world.destroyEntity(req.targetId);
      this.world.eventBus.emit('unitDead', { tick: this.tick, entityId: req.targetId });
    }

    const payload = {
      tick: this.tick,
      attackerId: req.attackerId,
      defenderId: req.targetId,
      damage: result.finalDamage,
      hpLeft: targetCombat.hp,
      isCrit: result.isCrit,
      damageType: result.damageType,
    };

    this.recorder.record(this.tick, 'damage', payload);
    this.world.eventBus.emit('damage', payload);
  }

  public applySimpleDamage(attackerId: number, targetId: number, damage: number): void {
    this.applyDamage({
      attackerId,
      targetId,
      skillId: 0,
      damage,
      damageType: DamageType.Physical,
      critRate: 0,
      critMultiplier: 1.5,
    });
  }

  public applyBuff(entityId: number, buffId: string): void {
    const entity = this.world.getEntity(entityId);
    const comp = entity?.get<BuffComponent>('Buff');
    if (!entity || !comp) return;

    const meta = this.buffFactory.create(buffId);
    const current = comp.buffs.get(buffId);
    const next = this.buffStackRule.apply(current, meta, meta.stackPolicy);
    comp.buffs.set(buffId, next);
    meta.onApply?.(this, entityId, next.stacks);

    const payload = { tick: this.tick, entityId, buffId, stacks: next.stacks };
    this.recorder.record(this.tick, 'buffApply', payload);
    this.world.eventBus.emit('buffApply', payload);
    this.world.eventBus.emit('buffAdd', {
      entityId,
      buffId,
      stacks: next.stacks,
      stackPolicy: next.stackPolicy,
      effectType: meta.effectType ?? 'Trigger',
    });
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
