import { System } from '../../core/ecs/System';
import { SystemPriority } from '../../core/ecs/SystemPriority';
import { EngineEvent, type SkillCastEvent } from '../../core/event/EventTypes';
import type { SkillGraph } from './SkillGraph';
import { SkillRuntime } from './SkillRuntime';

export class SkillSystem extends System {
  private readonly runtime = new SkillRuntime();
  private readonly skills = new Map<string, SkillGraph>();

  constructor() { super(SystemPriority.SKILL); }

  public onAttach(world: import('../../core/ecs/World').World): void {
    super.onAttach(world);
    this.world.eventBus.on(EngineEvent.SKILL_CAST, (payload) => this.cast(payload as SkillCastEvent));
  }

  public register(graph: SkillGraph): void { this.skills.set(graph.id, graph); }

  public cast(ev: SkillCastEvent): void {
    const graph = this.skills.get(ev.skillId);
    if (!graph) return;
    this.runtime.execute({ casterId: ev.casterId, targetId: ev.targetId, graph, world: this.world });
  }

  public update(): void {}
}
