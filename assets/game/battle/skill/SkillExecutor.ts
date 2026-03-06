import { SkillGraph } from './SkillGraph';
import type { SkillContext } from './SkillNode';

export class SkillExecutor {
  public execute(graph: SkillGraph, ctx: SkillContext): void {
    if (!graph.entryNodeId) return;
    const queue = [graph.entryNodeId];
    const visited = new Set<string>();

    while (queue.length > 0) {
      const nodeId = queue.shift() as string;
      if (visited.has(nodeId)) continue;
      visited.add(nodeId);
      const node = graph.nodes.get(nodeId);
      if (!node) continue;
      node.run(ctx);
      for (const nextId of graph.edges.get(nodeId) ?? []) {
        queue.push(nextId);
      }
    }
  }
}
