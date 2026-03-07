import type { World } from './World';

export abstract class System {
  public enabled = true;
  protected world!: World;
  constructor(public readonly priority = 0) {}
  public onAttach(world: World): void { this.world = world; }
  public abstract update(dt: number): void;
}
