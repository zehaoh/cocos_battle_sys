import type { SkillContext } from './SkillContext';
import type { SkillGraph } from './SkillGraph';

export class SkillRuntime {
  public execute(_graph: SkillGraph, _ctx: SkillContext): void {
    // execute graph nodes in order.
  }
}
