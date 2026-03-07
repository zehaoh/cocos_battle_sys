import { HealthComponent } from '../components/HealthComponent';
import { System } from '../../core/ecs/System';
import { SystemPriority } from '../../core/ecs/SystemPriority';

export class UnitSystem extends System {
  constructor() { super(SystemPriority.RENDER - 50); }
  public update(): void {
    for (const entity of this.world.query(['Health'])) {
      const hp = entity.getComponent<HealthComponent>('Health');
      if (hp && hp.hp <= 0) {
        this.world.eventBus.emit('UNIT_DEAD_PENDING', { deadId: entity.id });
      }
    }
  }
}
