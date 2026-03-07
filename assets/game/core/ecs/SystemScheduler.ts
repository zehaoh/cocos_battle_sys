import { System } from './System';
import type { World } from './World';

export class SystemScheduler {
  private readonly systems: System[] = [];

  public add(system: System, world: World): void {
    this.systems.push(system);
    this.systems.sort((a, b) => a.priority - b.priority);
    system.onAttach(world);
  }

  public remove(system: System, world: World): void {
    const index = this.systems.indexOf(system);
    if (index < 0) return;
    this.systems.splice(index, 1);
    system.onDetach(world);
  }

  public update(world: World, dt: number): void {
    for (const system of this.systems) {
      if (!system.enabled) continue;
      system.update(world, dt);
    }
  }

  public clear(world: World): void {
    for (const system of this.systems) {
      system.onDetach(world);
    }
    this.systems.length = 0;
  }
}
