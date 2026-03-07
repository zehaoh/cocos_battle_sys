import type { Component } from '../../core/ecs/Component';
import type { BuffInstance } from '../buff/BuffInstance';

export class BuffComponent implements Component {
  public readonly type = 'Buff';
  public readonly buffs: BuffInstance[] = [];
}
