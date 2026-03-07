import type { Component } from '../../core/ecs/Component';
import { AnimationStateMachine } from '../../animation/AnimationStateMachine';

export class AnimationComponent implements Component {
  public readonly type = 'Animation';
  constructor(public machine = new AnimationStateMachine()) {}
}
