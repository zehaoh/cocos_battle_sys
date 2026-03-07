import { EventBus } from '../event/EventBus';
import { Entity, type EntityId } from './Entity';
import { System } from './System';

export class World {
  public readonly entities = new Map<EntityId, Entity>();
  public readonly systems: System[] = [];
  public readonly eventBus = new EventBus<Record<string, unknown>>();
  private nextId = 1;

  public createEntity(): Entity {
    const entity = new Entity(this.nextId++);
    this.entities.set(entity.id, entity);
    return entity;
  }

  public getEntity(entityId: EntityId): Entity | undefined {
    return this.entities.get(entityId);
  }

  public addSystem(system: System): void {
    system.onAttach(this);
    this.systems.push(system);
  }

  public query(required: string[]): Entity[] {
    const out: Entity[] = [];
    for (const entity of this.entities.values()) {
      if (entity.hasAll(required)) out.push(entity);
    }
    return out;
  }

  public update(dt: number): void {
    this.systems.sort((a,b)=>a.priority-b.priority);
    for (const system of this.systems) {
      if (system.enabled) {
        console.log("SYSTEM UPDATE", system.constructor.name);
        system.update(this, dt);
      }
    }
  }
}
