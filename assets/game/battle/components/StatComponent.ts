import { BaseComponent } from '../../core/ecs/Component';

export class StatComponent extends BaseComponent {
  public readonly type = 'Stat';

  constructor(
    public baseAttack = 10,
    public baseDefense = 3,
    public baseCritRate = 0.1,
    public baseCritDamage = 1.5,
    public finalAttack = 10,
    public finalDefense = 3,
    public finalCritRate = 0.1,
    public finalCritDamage = 1.5,
    public speed = 4,
  ) {
    super();
  }
}
