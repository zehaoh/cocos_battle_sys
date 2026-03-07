import type { Component } from '../../core/ecs/Component';

export class SkillBookComponent implements Component {
  public readonly type = 'SkillBook';
  constructor(public skills: string[]) {}
}
