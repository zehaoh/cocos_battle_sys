import { EngineEvent } from '../core/event/EventTypes';
import { BattleSimulator } from '../simulation/BattleSimulator';
import { BattleEngine } from '../battle/runtime/BattleEngine';
import { UnitFactory } from '../battle/factory/UnitFactory';
import { createMonsterTree } from '../ai/behaviorTree/AIBehaviors';
import { AIComponent } from '../battle/components/AIComponent';
import { AggroComponent } from '../battle/components/AggroComponent';
import { DEFAULT_SKILLS } from '../battle/runtime/SkillBootstrap';
import { HealthComponent } from '../battle/components/HealthComponent';

export function runDemoSimulation(frames = 20): string[] {
  const logs: string[] = [];
  const engine = new BattleEngine();
  engine.installDefaultSystems();

  for (const graph of DEFAULT_SKILLS) engine.skillSystem.register(graph);

  const factory = new UnitFactory(engine.world);
  const playerId = factory.createPlayer();
  const monsterId = factory.createMonster(5, 2);

  const monster = engine.world.entityManager.get(monsterId)!;
  monster.addComponent(new AIComponent(createMonsterTree(), playerId));
  monster.addComponent(new AggroComponent());

  engine.world.eventBus.on(EngineEvent.DAMAGE, (e) => {
    const d = e as { attackerId: number; targetId: number; amount: number; crit: boolean };
    logs.push(`DAMAGE a=${d.attackerId} -> t=${d.targetId} val=${d.amount} crit=${d.crit}`);
  });

  const sim = new BattleSimulator(engine.world, 0.2);

  // Player action flow: Player -> SkillSystem -> CombatSystem -> Damage
  sim.queue.push({ frame: 1, type: EngineEvent.SKILL_CAST, entityId: playerId, params: { casterId: playerId, targetId: monsterId, skillId: 'slash' } });
  sim.queue.push({ frame: 3, type: EngineEvent.SKILL_CAST, entityId: playerId, params: { casterId: playerId, targetId: monsterId, skillId: 'poison_strike' } });

  for (let i = 0; i < frames; i++) sim.tick();

  const mHp = engine.world.entityManager.get(monsterId)?.getComponent<HealthComponent>('Health')?.hp ?? -1;
  const pHp = engine.world.entityManager.get(playerId)?.getComponent<HealthComponent>('Health')?.hp ?? -1;
  logs.push(`FINAL_HP player=${pHp} monster=${mHp}`);
  return logs;
}
