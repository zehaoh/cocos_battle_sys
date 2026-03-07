import type { World } from './World';

export abstract class System {
  public enabled = true;

  constructor(public readonly priority = 0) {}

  public onAttach(_world: World): void {}

  public onDetach(_world: World): void {}

  public abstract update(world: World, dt: number): void;
}
