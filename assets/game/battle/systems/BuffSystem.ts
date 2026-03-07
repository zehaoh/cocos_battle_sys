import { System } from '../../core/ecs/System';
import type { World } from '../../core/ecs/World';
import type { BattleWorld } from '../BattleWorld';
import { BuffFactory } from '../buff/BuffFactory';
import { BuffComponent } from '../components/BuffComponent';

export class BuffSystem extends System {
  constructor(
    private readonly buffFactory: BuffFactory,
    private readonly battleWorld: BattleWorld,
  ) {
    super(20);
  }

  public update(world: World, dt: number): void {
    for (const entity of world.query(['Buff'])) {
      const buffComp = entity.get<BuffComponent>('Buff') as BuffComponent;
      for (const [buffId, active] of buffComp.buffs) {
        const buff = this.buffFactory.create(buffId);

        active.durationLeft -= dt;
        active.periodLeft -= dt;
        active.elapsed += dt;

        if (active.periodLeft <= 0) {
          buff.onTick?.(this.battleWorld, entity.id, active.stacks);
          world.eventBus.emit('buffTick', {
            entityId: entity.id,
            buffId,
            stacks: active.stacks,
            effectType: buff.effectType ?? 'Trigger',
          });
          active.periodLeft += buff.tickPeriod;
        }

        if (active.durationLeft <= 0) {
          buff.onExpire?.(this.battleWorld, entity.id);
          buffComp.buffs.delete(buffId);
          world.eventBus.emit('buffExpire', { entityId: entity.id, buffId });
        }
      }
    }
  }
}
