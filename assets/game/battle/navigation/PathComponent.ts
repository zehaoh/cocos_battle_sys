import { BaseComponent } from '../../core/ecs/Component';
import type { NavPoint } from './Path';

export class PathComponent extends BaseComponent {
  public readonly type = 'Path';

  constructor(
    public path: NavPoint[] = [],
    public currentIndex = 0,
    public speed = 5,
  ) {
    super();
  }
}
