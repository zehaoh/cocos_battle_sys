import { System } from '../../core/ecs/System';
import type { World } from '../../core/ecs/World';
import { SystemPriority } from '../../core/ecs/SystemPriority';

export enum BuffTrigger {
  OnAdd = 'OnAdd',
  OnRemove = 'OnRemove',
  OnTick = 'OnTick',
  OnDamage = 'OnDamage',
}

export class BuffSystem extends System {
  constructor() {
    super(SystemPriority.BUFF);
  }

  public override onAttach(world: World): void {
    super.onAttach(world);
    this.world.eventBus.on('BuffAddEvent', () => {
      this.emit('BuffTriggerEvent', { trigger: BuffTrigger.OnAdd });
    });
    this.world.eventBus.on('DamageEvent', () => {
      this.emit('BuffTriggerEvent', { trigger: BuffTrigger.OnDamage });
    });
  }

  public update(_world: World, _dt: number): void {
    this.emit('BuffTriggerEvent', { trigger: BuffTrigger.OnTick });
  }
}
