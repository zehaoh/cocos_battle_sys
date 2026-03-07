import { System } from '../../core/ecs/System';
import { SystemPriority } from '../../core/ecs/SystemPriority';
import { EngineEvent, type AttackEvent } from '../../core/event/EventTypes';
import { HealthComponent } from '../components/HealthComponent';
import { StatsComponent } from '../components/StatsComponent';
import { DamageCalculator } from './DamageCalculator';

export class CombatSystem extends System {
  constructor() { super(SystemPriority.COMBAT); }

  public onAttach(world: import('../../core/ecs/World').World): void {
    super.onAttach(world);
    this.world.eventBus.on(EngineEvent.ATTACK, (payload) => this.attack(payload as AttackEvent));
  }

  public attack(event: AttackEvent): void {
    const attacker = this.world.entityManager.get(event.attackerId);
    const target = this.world.entityManager.get(event.targetId);
    if (!attacker || !target) return;

    const aStats = attacker.getComponent<StatsComponent>('Stats');
    const tStats = target.getComponent<StatsComponent>('Stats');
    const hp = target.getComponent<HealthComponent>('Health');
    if (!aStats || !tStats || !hp || hp.hp <= 0) return;

    const result = DamageCalculator.calculate({
      attackerId: event.attackerId,
      targetId: event.targetId,
      baseDamage: 1,
      attack: aStats.attack,
      defense: tStats.defense,
      critChance: aStats.critChance,
      critMultiplier: aStats.critMultiplier,
    });

    this.applyDamage(event.attackerId, event.targetId, result.finalDamage, result.crit);
  }

  public applyDamage(attackerId: number, targetId: number, damage: number, crit: boolean): void {
    const target = this.world.entityManager.get(targetId);
    if (!target) return;
    const hp = target.getComponent<HealthComponent>('Health');
    if (!hp) return;

    let left = damage;
    if (hp.shield > 0) {
      const absorbed = Math.min(hp.shield, left);
      hp.shield -= absorbed;
      left -= absorbed;
    }
    hp.hp = Math.max(0, hp.hp - left);

    this.world.eventBus.emit(EngineEvent.DAMAGE, { attackerId, targetId, amount: damage, crit });
    if (hp.hp <= 0) this.world.eventBus.emit(EngineEvent.DEATH, { deadId: targetId, killerId: attackerId });
  }

  public update(): void {}
}
