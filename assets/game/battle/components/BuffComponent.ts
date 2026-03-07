import { BaseComponent } from '../../core/ecs/Component';
import type { BuffStackPolicy } from '../buff/BuffStackRule';

export interface ActiveBuff {
  id: string;
  stacks: number;
  durationLeft: number;
  periodLeft: number;
  elapsed: number;
  stackPolicy: BuffStackPolicy;
}

export class BuffComponent extends BaseComponent {
  public readonly type = 'Buff';
  public readonly buffs = new Map<string, ActiveBuff>();
}
