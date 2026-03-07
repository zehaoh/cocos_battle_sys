import type { BattleWorld } from '../BattleWorld';

export interface StartSkillEvent {
  casterId: number;
  skillId: string;
  targetId: number | null;
}

export class SkillGraphRuntime {
  constructor(private readonly battleWorld: BattleWorld) {}

  public startSkill(event: StartSkillEvent): void {
    const graph = this.battleWorld.getSkillGraph(event.skillId);
    if (!graph) return;

    this.battleWorld.skillExecutor.execute(graph, {
      casterId: event.casterId,
      targetId: event.targetId,
      world: this.battleWorld,
    });

    this.battleWorld.world.eventBus.emit('skillGraphExecuted', {
      casterId: event.casterId,
      skillId: event.skillId,
      targetId: event.targetId,
      graphId: graph.id,
    });
  }
}
