import { System } from '../../core/ecs/System';
import { SystemPriority } from '../../core/ecs/SystemPriority';
import { EngineEvent } from '../../core/event/EventTypes';
import { AggroComponent } from '../../battle/components/AggroComponent';
import { AIComponent } from '../../battle/components/AIComponent';

export class AggroSystem extends System {
  constructor() { super(SystemPriority.AGGRO); }

  public onAttach(world: import('../../core/ecs/World').World): void {
    super.onAttach(world);
    this.world.eventBus.on(EngineEvent.DAMAGE, (payload) => {
      const e = payload as { attackerId: number; targetId: number; amount: number };
      this.applyThreat(e.targetId, e.attackerId, e.amount);
    });
    this.world.eventBus.on('HEAL', (payload) => {
      const e = payload as { sourceId: number; targetId: number; amount: number };
      this.applyThreat(e.targetId, e.sourceId, e.amount * 0.5);
    });
    this.world.eventBus.on('TAUNT', (payload) => {
      const e = payload as { sourceId: number; targetId: number; amount: number };
      this.applyThreat(e.targetId, e.sourceId, e.amount);
    });
  }

  private applyThreat(ownerId: number, sourceId: number, amount: number): void {
    const entity = this.world.entityManager.get(ownerId);
    if (!entity) return;
    let aggro = entity.getComponent<AggroComponent>('Aggro');
    if (!aggro) {
      aggro = new AggroComponent();
      entity.addComponent(aggro);
    }
    aggro.threat.add(sourceId, amount);
  }

  public update(dt: number): void {
    const decay = Math.pow(0.98, dt);
    for (const entity of this.world.query(['Aggro'])) {
      const aggro = entity.getComponent<AggroComponent>('Aggro');
      const ai = entity.getComponent<AIComponent>('AI');
      if (!aggro) continue;
      aggro.threat.decay(decay);
      aggro.currentTarget = aggro.threat.top();
      if (ai) ai.targetId = aggro.currentTarget;
    }
  }
}
