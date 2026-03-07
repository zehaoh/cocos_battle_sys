import { BaseComponent } from '../../core/ecs/Component';

export class TransformComponent extends BaseComponent {
  public readonly type = 'Transform';

  constructor(
    public x = 0,
    public y = 0,
    public rotation = 0,
  ) {
    super();
  }
}
