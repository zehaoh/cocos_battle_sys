import type { SkillGraphAsset } from '../SkillGraph';
import { SkillGraphUtil } from '../SkillGraph';

export class SkillGraphPreview {
  public simulateLinear(graph: SkillGraphAsset): number[] {
    const out: number[] = [];
    let cursor = graph.entry;
    const visited = new Set<number>();

    while (!visited.has(cursor)) {
      visited.add(cursor);
      out.push(cursor);
      const next = SkillGraphUtil.nextNodeIds(graph, cursor)[0];
      if (next === undefined) break;
      cursor = next;
    }

    return out;
  }
}
