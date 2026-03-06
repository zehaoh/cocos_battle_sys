import { BaseComponent } from '../../core/ecs/Component';

export class ProjectileComponent extends BaseComponent {
  public readonly type = 'Projectile';

  constructor(
    public ownerId: number,
    public targetId: number,
    public speed: number,
    public damage: number,
    public hitRadius = 0.3,
    public homing = true,
  ) {
    super();
  }
}
