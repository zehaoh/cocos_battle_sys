import type { SkillGraph } from './SkillGraph';
import { SkillGraphUtil } from './SkillGraph';
import { SkillNodeFactory } from './SkillNodeFactory';
import type { SkillContext } from './SkillNode';
import { AddBuffNode } from './nodes/AddBuffNode';
import { CastNode } from './nodes/CastNode';
import { ConditionNode } from './nodes/ConditionNode';
import { DamageNode } from './nodes/DamageNode';
import { DelayNode } from './nodes/DelayNode';
import { SpawnProjectileNode } from './nodes/SpawnProjectileNode';

export class SkillExecutor {
  private readonly factory = new SkillNodeFactory();

  constructor() {
    this.factory.register('Cast', CastNode);
    this.factory.register('SpawnProjectile', SpawnProjectileNode);
    this.factory.register('Damage', DamageNode);
    this.factory.register('AddBuff', AddBuffNode);
    this.factory.register('Delay', DelayNode);
    this.factory.register('Condition', ConditionNode);
  }

  public execute(graph: SkillGraph, ctx: Omit<SkillContext, 'graph'>): void {
    const runtimeContext: SkillContext = {
      ...ctx,
      graph,
    };

    this.walk(graph, runtimeContext, [graph.entry], new Set<number>());
  }

  public resume(graph: SkillGraph, ctx: SkillContext, startNodeIds: number[]): void {
    this.walk(graph, ctx, startNodeIds, new Set<number>());
  }

  private walk(graph: SkillGraph, ctx: SkillContext, startNodeIds: number[], visited: Set<number>): void {
    const queue = [...startNodeIds];

    while (queue.length > 0) {
      const nodeId = queue.shift() as number;
      if (visited.has(nodeId)) continue;
      visited.add(nodeId);

      const nodeData = SkillGraphUtil.findNode(graph, nodeId);
      if (!nodeData) continue;

      const handler = this.factory.create(nodeData.type);
      const result = handler.execute(nodeData, ctx);
      if (result?.stop) {
        return;
      }

      const nextIds = result?.nextNodeIds ?? nodeData.next;
      for (const nextId of nextIds) {
        queue.push(nextId);
      }
    }
  }
}
