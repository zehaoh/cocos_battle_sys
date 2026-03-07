import type { BuffInstance } from '../BuffInstance';
import { HealthComponent } from '../../components/HealthComponent';
import { StatsComponent } from '../../components/StatsComponent';

export class PoisonHandler {
  public static onAdd(world: import('../../../core/ecs/World').World, targetId: number, buff: BuffInstance): void {
    const e = world.entityManager.get(targetId);
    if (!e) return;
    const hp = e.getComponent<HealthComponent>('Health');
    const stats = e.getComponent<StatsComponent>('Stats');
    if ('Poison' === 'Shield' && hp) hp.shield += buff.magnitude;
    if ('Poison' === 'Slow' && stats) stats.moveSpeed *= 0.8;
    if ('Poison' === 'Stun' && stats) stats.moveSpeed = 0;
  }

  public static onTick(world: import('../../../core/ecs/World').World, targetId: number, buff: BuffInstance): void {
    const e = world.entityManager.get(targetId);
    if (!e) return;
    const hp = e.getComponent<HealthComponent>('Health');
    if (!hp) return;
    if (['Poison','Burn','Bleed'].includes('Poison')) {
      hp.hp = Math.max(0, hp.hp - Math.max(1, Math.floor(buff.magnitude)));
    }
    if ('Poison' === 'Regen') {
      hp.hp = Math.min(hp.maxHp, hp.hp + Math.max(1, Math.floor(buff.magnitude)));
    }
  }

  public static onRemove(world: import('../../../core/ecs/World').World, targetId: number, _buff: BuffInstance): void {
    const e = world.entityManager.get(targetId);
    if (!e) return;
    const stats = e.getComponent<StatsComponent>('Stats');
    if (!stats) return;
    if (['Slow','Stun'].includes('Poison')) stats.moveSpeed = Math.max(stats.moveSpeed, 1);
  }
}
