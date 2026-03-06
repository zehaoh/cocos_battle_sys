import { BaseComponent } from '../../core/ecs/Component';

export class MoveComponent extends BaseComponent {
  public readonly type = 'Move';

  constructor(
    public speed = 4,
    public destinationX = 0,
    public destinationY = 0,
    public moving = false,
  ) {
    super();
  }
}
