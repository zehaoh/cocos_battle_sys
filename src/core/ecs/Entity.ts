import type { Component } from './Component';

export type EntityId = number;

export class Entity {
  private readonly components = new Map<string, Component>();

  constructor(public readonly id: EntityId) {}

  public add(component: Component): this {
    this.components.set(component.type, component);
    return this;
  }

  public remove(type: string): this {
    this.components.delete(type);
    return this;
  }

  public get<T extends Component>(type: string): T | undefined {
    return this.components.get(type) as T | undefined;
  }

  public has(type: string): boolean {
    return this.components.has(type);
  }

  public hasAll(types: string[]): boolean {
    return types.every((type) => this.components.has(type));
  }

  public entries(): IterableIterator<[string, Component]> {
    return this.components.entries();
  }
}
