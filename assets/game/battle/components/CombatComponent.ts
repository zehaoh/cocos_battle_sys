import { BaseComponent } from '../../core/ecs/Component';

export class CombatComponent extends BaseComponent {
  public readonly type = 'Combat';

  constructor(
    public team = 0,
    public hp = 100,
    public maxHp = 100,
    public attack = 10,
    public defense = 3,
    public attackRange = 2,
    public attackCooldown = 1,
    public cooldownLeft = 0,
    public alive = true,
  ) {
    super();
  }
}
