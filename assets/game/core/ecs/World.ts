import { ComponentManager } from './ComponentManager';
import type { Component } from './Component';
import { Entity, type EntityId } from './Entity';
import { EntityManager } from './EntityManager';
import { System } from './System';

export class World {
  private readonly entityManager = new EntityManager();
  private readonly componentManager = new ComponentManager();
  private readonly systems: System[] = [];
  private readonly deferredRemovals: EntityId[] = [];

  public createEntity(): Entity {
    return this.entityManager.createEntity();
  }

  public destroyEntity(entityId: EntityId): void {
    this.deferredRemovals.push(entityId);
  }

  public getEntity(entityId: EntityId): Entity | undefined {
    return this.entityManager.getEntity(entityId);
  }

  public addComponent(entityId: EntityId, component: Component): void {
    const entity = this.requireEntity(entityId);
    entity.add(component);
    this.componentManager.onAdded(entity, component);
  }

  public removeComponent(entityId: EntityId, type: string): void {
    const entity = this.requireEntity(entityId);
    if (entity.has(type)) {
      entity.remove(type);
      this.componentManager.onRemoved(entity, type);
    }
  }

  public query(required: string[]): Entity[] {
    if (required.length === 0) return [];

    const ids = this.componentManager.entitiesWithAll(required);
    const out: Entity[] = [];
    for (const entityId of ids) {
      const entity = this.entityManager.getEntity(entityId);
      if (entity) out.push(entity);
    }
    return out;
  }

  public registerSystem(system: System): void {
    this.systems.push(system);
    this.systems.sort((a, b) => a.priority - b.priority);
    system.onAttach(this);
  }

  public unregisterSystem(system: System): void {
    const index = this.systems.indexOf(system);
    if (index >= 0) {
      this.systems.splice(index, 1);
      system.onDetach(this);
    }
  }

  public update(dt: number): void {
    for (const system of this.systems) {
      if (!system.enabled) continue;
      system.update(this, dt);
    }
    this.flushEntityRemovals();
  }

  public getEntities(): IterableIterator<Entity> {
    return this.entityManager.getAll();
  }

  public clear(): void {
    this.systems.length = 0;
    this.componentManager.clear();
    this.entityManager.clear();
    this.deferredRemovals.length = 0;
  }

  private flushEntityRemovals(): void {
    if (this.deferredRemovals.length === 0) return;
    for (const entityId of this.deferredRemovals) {
      const entity = this.entityManager.getEntity(entityId);
      if (!entity) continue;
      this.componentManager.clearEntity(entity);
      this.entityManager.removeEntity(entityId);
    }
    this.deferredRemovals.length = 0;
  }

  private requireEntity(entityId: EntityId): Entity {
    const entity = this.entityManager.getEntity(entityId);
    if (!entity) throw new Error(`Entity ${entityId} not found`);
    return entity;
  }
}
