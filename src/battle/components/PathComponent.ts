import type { Component } from '../../core/ecs/Component';
import type { Vec2 } from '../../core/math/Vec2';

export class PathComponent implements Component {
  public readonly type = 'Path';
  constructor(public path: Vec2[] = [], public index = 0) {}
}
