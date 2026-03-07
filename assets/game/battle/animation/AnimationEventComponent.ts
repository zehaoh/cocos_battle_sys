import { BaseComponent } from '../../core/ecs/Component';
import type { AnimationEvent } from './AnimationEvent';

export class AnimationEventComponent extends BaseComponent {
  public readonly type = 'AnimationEvent';

  constructor(
    public events: AnimationEvent[] = [],
    public currentFrame = 0,
    public playing = false,
    public targetId: number | null = null,
    public skillId = 0,
  ) {
    super();
  }
}
