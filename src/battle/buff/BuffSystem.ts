import { System } from '../../core/ecs/System';
import { SystemPriority } from '../../core/ecs/SystemPriority';
import { EngineEvent } from '../../core/event/EventTypes';
import { BuffComponent } from '../components/BuffComponent';
import { BuffInstance } from './BuffInstance';
import { BuffType } from './BuffType';
import { poisonTick } from './effects/PoisonEffect';
import { applyShield } from './effects/ShieldEffect';
import { applySlow } from './effects/SlowEffect';
import { applyStun } from './effects/StunEffect';

export class BuffSystem extends System {
  constructor() { super(SystemPriority.BUFF); }

  public onAttach(world: import('../../core/ecs/World').World): void {
    super.onAttach(world);
    this.world.eventBus.on(EngineEvent.BUFF_ADD, (payload) => {
      const ev = payload as { targetId: number; buffId: string; sourceId: number };
      this.addBuff(ev.targetId, ev.sourceId, ev.buffId as BuffType);
    });
  }

  public addBuff(targetId: number, sourceId: number, type: BuffType): void {
    const entity = this.world.entityManager.get(targetId);
    if (!entity) return;
    let comp = entity.getComponent<BuffComponent>('Buff');
    if (!comp) {
      comp = new BuffComponent();
      entity.addComponent(comp);
    }
    const instance = new BuffInstance(type, sourceId, 5, 4, 1);
    comp.buffs.push(instance);

    if (type === BuffType.Shield) applyShield(this.world, targetId, 20);
    if (type === BuffType.Slow) applySlow(this.world, targetId, 0.2);
    if (type === BuffType.Stun) applyStun(this.world, targetId, 99);
  }

  public update(dt: number): void {
    for (const entity of this.world.query(['Buff'])) {
      const comp = entity.getComponent<BuffComponent>('Buff');
      if (!comp) continue;
      for (let i = comp.buffs.length - 1; i >= 0; i--) {
        const buff = comp.buffs[i];
        buff.elapsed += dt;
        buff.tickElapsed += dt;

        if (buff.type === BuffType.Poison && buff.tickElapsed >= buff.tick) {
          buff.tickElapsed = 0;
          poisonTick(this.world, entity.id, buff);
        }

        if (buff.elapsed >= buff.duration) {
          comp.buffs.splice(i, 1);
          this.world.eventBus.emit(EngineEvent.BUFF_REMOVE, { targetId: entity.id, buffId: buff.type });
        }
      }
    }
  }
}
