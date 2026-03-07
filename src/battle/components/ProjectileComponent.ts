import type { Component } from '../../core/ecs/Component';
import type { Vec2 } from '../../core/math/Vec2';
import type { ProjectileBehavior } from '../projectile/ProjectileBehavior';

export class ProjectileComponent implements Component {
  public readonly type = 'Projectile';
  public age = 0;
  constructor(
    public casterId: number,
    public speed: number,
    public direction: Vec2,
    public lifeTime: number,
    public radius: number,
    public damage: number,
    public behaviors: ProjectileBehavior[],
  ) {}
}
