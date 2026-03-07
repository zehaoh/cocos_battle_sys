import type { SkillGraphAsset } from '../SkillGraph';

export class GraphSerializer {
  public serialize(graph: SkillGraphAsset): string {
    return JSON.stringify(graph, null, 2);
  }

  public deserialize(json: string): SkillGraphAsset {
    return JSON.parse(json) as SkillGraphAsset;
  }
}
