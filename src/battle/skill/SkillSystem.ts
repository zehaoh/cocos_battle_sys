import { System } from '../../core/ecs/System';
import type { World } from '../../core/ecs/World';
import { SystemPriority } from '../../core/ecs/SystemPriority';
import type { SkillGraph } from './SkillGraph';
import { SkillRuntime } from './SkillRuntime';

export class SkillSystem extends System {
  private readonly runtime = new SkillRuntime();
  private readonly graphs = new Map<string, SkillGraph>();

  constructor() {
    super(SystemPriority.SKILL);
  }

  public update(_world: World, _dt: number): void {
    // command/event driven
  }

  public registerSkill(graph: SkillGraph): void {
    this.graphs.set(graph.id, graph);
  }
}
