import type { Component } from '../../core/ecs/Component';

export class HealthComponent implements Component {
  public readonly type = 'Health';
  constructor(public hp: number, public maxHp: number, public shield = 0) {}
}
