import type { Component } from './Component';
import type { Entity } from './Entity';

export class ComponentManager {
  private readonly index = new Map<string, Set<number>>();

  public onAdded(entity: Entity, component: Component): void {
    let set = this.index.get(component.type);
    if (!set) {
      set = new Set<number>();
      this.index.set(component.type, set);
    }
    set.add(entity.id);
  }

  public onRemoved(entity: Entity, type: string): void {
    this.index.get(type)?.delete(entity.id);
  }

  public entitiesWith(type: string): ReadonlySet<number> {
    return this.index.get(type) ?? new Set<number>();
  }

  public entitiesWithAll(types: string[]): number[] {
    if (types.length === 0) return [];

    const sorted = [...types].sort((a, b) => this.entitiesWith(a).size - this.entitiesWith(b).size);
    const seed = this.entitiesWith(sorted[0]);
    if (seed.size === 0) return [];

    const out: number[] = [];
    for (const entityId of seed) {
      let ok = true;
      for (let i = 1; i < sorted.length; i++) {
        if (!this.entitiesWith(sorted[i]).has(entityId)) {
          ok = false;
          break;
        }
      }
      if (ok) out.push(entityId);
    }
    return out;
  }

  public clearEntity(entity: Entity): void {
    for (const [type] of entity.entries()) {
      this.onRemoved(entity, type);
    }
  }

  public clear(): void {
    this.index.clear();
  }
}
