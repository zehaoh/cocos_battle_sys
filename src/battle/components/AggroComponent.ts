import type { Component } from '../../core/ecs/Component';
import { ThreatTable } from '../../ai/aggro/ThreatTable';

export class AggroComponent implements Component {
  public readonly type = 'Aggro';
  public readonly threat = new ThreatTable();
  public currentTarget: number | null = null;
}
