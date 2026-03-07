import { BaseComponent } from '../../core/ecs/Component';

export type ProjectileBehavior = 'Linear' | 'Homing' | 'Bounce' | 'Split';

export class ProjectileComponent extends BaseComponent {
  public readonly type = 'Projectile';

  constructor(
    public projectileId: number,
    public casterId: number,
    public targetId: number | null,
    public speed: number,
    public directionX: number,
    public directionY: number,
    public lifeTime: number,
    public age = 0,
    public radius = 0.3,
    public penetrate = 1,
    public behavior: ProjectileBehavior = 'Linear',
    public damage = 10,
    public bounceLeft = 0,
    public splitCount = 0,
    public hitTargets: Set<number> = new Set<number>(),
  ) {
    super();
  }
}
