import { BaseComponent } from '../../core/ecs/Component';

export type ProjectileType = 'homing' | 'linear' | 'pierce' | 'split' | 'bounce';

export class ProjectileComponent extends BaseComponent {
  public readonly type = 'Projectile';

  constructor(
    public ownerId: number,
    public targetId: number,
    public speed: number,
    public damage: number,
    public hitRadius = 0.3,
    public projectileType: ProjectileType = 'homing',
    public pierceLeft = 0,
    public splitCount = 0,
    public bounceLeft = 0,
    public dirX = 0,
    public dirY = 0,
    public hitSet: Set<number> = new Set<number>(),
  ) {
    super();
  }
}
