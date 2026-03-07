import { BaseComponent } from '../../core/ecs/Component';
import { ThreatTable } from '../aggro/ThreatTable';

export class ThreatComponent extends BaseComponent {
  public readonly type = 'Threat';

  constructor(
    public readonly table = new ThreatTable(),
    public currentTarget: number | null = null,
  ) {
    super();
  }
}
