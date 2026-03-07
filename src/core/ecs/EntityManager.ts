import { Entity } from './Entity';

export class EntityManager {
  private readonly entities = new Map<number, Entity>();
  private nextId = 1;

  public create(): Entity {
    const entity = new Entity(this.nextId++);
    this.entities.set(entity.id, entity);
    return entity;
  }

  public get(id: number): Entity | undefined { return this.entities.get(id); }
  public remove(id: number): void { this.entities.delete(id); }
  public values(): IterableIterator<Entity> { return this.entities.values(); }
  public size(): number { return this.entities.size; }
}
