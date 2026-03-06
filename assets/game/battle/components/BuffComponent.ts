import { BaseComponent } from '../../core/ecs/Component';

export interface ActiveBuff {
  id: string;
  stacks: number;
  durationLeft: number;
  periodLeft: number;
}

export class BuffComponent extends BaseComponent {
  public readonly type = 'Buff';
  public readonly buffs = new Map<string, ActiveBuff>();
}
