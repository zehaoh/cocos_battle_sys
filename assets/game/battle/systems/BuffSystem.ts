import { System } from '../../core/ecs/System';
import type { World } from '../../core/ecs/World';
import { BuffFactory } from '../buff/BuffFactory';
import { BuffComponent } from '../components/BuffComponent';

export class BuffSystem extends System {
  constructor(private readonly buffFactory: BuffFactory) {
    super(20);
  }

  public update(world: World, dt: number): void {
    for (const entity of world.query(['Buff'])) {
      const buffComp = entity.get<BuffComponent>('Buff') as BuffComponent;
      for (const [buffId, active] of buffComp.buffs) {
        const buff = this.buffFactory.create(buffId);
        active.durationLeft -= dt;
        active.periodLeft -= dt;

        if (active.periodLeft <= 0) {
          buff.onTick?.((world as unknown) as any, entity.id, active.stacks);
          active.periodLeft += buff.tickPeriod;
        }

        if (active.durationLeft <= 0) {
          buff.onExpire?.((world as unknown) as any, entity.id);
          buffComp.buffs.delete(buffId);
        }
      }
    }
  }
}
