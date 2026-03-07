import { EventBus } from '../event/EventBus';
import { EntityManager } from './EntityManager';
import { System } from './System';

export class World {
  public readonly entityManager = new EntityManager();
  public readonly systems: System[] = [];
  public readonly eventBus = new EventBus();

  public addSystem(system: System): void {
    system.onAttach(this);
    this.systems.push(system);
    this.systems.sort((a, b) => a.priority - b.priority);
  }

  public query(types: string[]) {
    const out = [];
    for (const entity of this.entityManager.values()) {
      if (entity.hasAll(types)) out.push(entity);
    }
    return out;
  }

  public update(dt: number): void {
    this.systems.sort((a, b) => a.priority - b.priority);
    for (const system of this.systems) {
      if (!system.enabled) continue;
      console.log('SYSTEM UPDATE', system.constructor.name);
      system.update(dt);
    }
  }
}
