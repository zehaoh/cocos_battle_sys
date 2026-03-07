import { HealthComponent } from '../components/HealthComponent';
import { System } from '../../core/ecs/System';
import { SystemPriority } from '../../core/ecs/SystemPriority';

export class RenderSystem extends System {
  private counter = 0;
  constructor() { super(SystemPriority.RENDER); }
  public update(dt: number): void {
    this.counter += dt;
    if (this.counter < 1) return;
    this.counter = 0;
    for (const entity of this.world.query(['Health'])) {
      const hp = entity.getComponent<HealthComponent>('Health');
      if (hp) this.world.eventBus.emit('RENDER_HP', { entityId: entity.id, hp: hp.hp });
    }
  }
}
