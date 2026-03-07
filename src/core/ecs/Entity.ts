import type { Component } from './Component';

export type EntityId = number;

export class Entity {
  public readonly components = new Map<string, Component>();
  constructor(public readonly id: EntityId) {}
  public addComponent(component: Component): this { this.components.set(component.type, component); return this; }
  public removeComponent(type: string): void { this.components.delete(type); }
  public getComponent<T extends Component>(type: string): T | undefined { return this.components.get(type) as T | undefined; }
  public hasComponent(type: string): boolean { return this.components.has(type); }
  public hasAll(types: string[]): boolean { return types.every((t) => this.components.has(t)); }
}
