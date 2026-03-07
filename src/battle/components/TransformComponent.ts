import type { Component } from '../../core/ecs/Component';
import type { Vec2 } from '../../core/math/Vec2';

export class TransformComponent implements Component {
  public readonly type = 'Transform';
  constructor(public position: Vec2) {}
}
