import { System } from '../../core/ecs/System';
import type { World } from '../../core/ecs/World';
import { CombatComponent } from '../components/CombatComponent';

export class DeathSystem extends System {
  constructor() {
    super(80);
  }

  public update(world: World, _dt: number): void {
    for (const entity of world.query(['Combat'])) {
      const combat = entity.get<CombatComponent>('Combat') as CombatComponent;
      if (combat.alive && combat.hp <= 0) {
        combat.alive = false;
        world.eventBus.emit('unitDead', { entityId: entity.id });
        world.eventBus.emit('dropRequest', { entityId: entity.id });
      }
    }
  }
}
