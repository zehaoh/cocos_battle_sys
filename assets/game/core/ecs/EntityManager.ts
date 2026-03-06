import { Entity, type EntityId } from './Entity';

export class EntityManager {
  private nextId = 1;
  private readonly entities = new Map<EntityId, Entity>();

  public createEntity(): Entity {
    const entity = new Entity(this.nextId++);
    this.entities.set(entity.id, entity);
    return entity;
  }

  public removeEntity(entityId: EntityId): void {
    this.entities.delete(entityId);
  }

  public getEntity(entityId: EntityId): Entity | undefined {
    return this.entities.get(entityId);
  }

  public getAll(): IterableIterator<Entity> {
    return this.entities.values();
  }

  public clear(): void {
    this.entities.clear();
    this.nextId = 1;
  }
}
