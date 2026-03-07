import type { World } from './World';

export abstract class System {
  public enabled = true;
  protected world!: World;

  constructor(public readonly priority = 0) {}

  public onAttach(world: World): void {
    this.world = world;
  }

  protected emit(event: string, payload: unknown): void {
    this.world.eventBus.emit(event, payload);
  }

  public onDetach(_world: World): void {}

  public abstract update(world: World, dt: number): void;
}
