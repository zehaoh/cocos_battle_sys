import { BaseComponent } from '../../core/ecs/Component';

export type AIState = 'Idle' | 'Chase' | 'Attack' | 'Retreat';

export class AIComponent extends BaseComponent {
  public readonly type = 'AI';

  constructor(
    public state: AIState = 'Idle',
    public thinkInterval = 0.2,
    public thinkLeft = 0,
  ) {
    super();
  }
}
