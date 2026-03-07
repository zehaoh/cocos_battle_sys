import { BaseComponent } from '../../core/ecs/Component';

export class TargetComponent extends BaseComponent {
  public readonly type = 'Target';

  constructor(public targetId: number | null = null) {
    super();
  }
}
