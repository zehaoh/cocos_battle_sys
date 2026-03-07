import type { Component } from '../../core/ecs/Component';

export class StatsComponent implements Component {
  public readonly type = 'Stats';
  constructor(
    public attack: number,
    public defense: number,
    public critChance: number,
    public critMultiplier: number,
    public moveSpeed: number,
  ) {}
}
