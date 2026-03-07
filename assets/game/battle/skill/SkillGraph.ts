export interface SkillNodeData {
  id: number;
  type: string;
  next: number[];
  params?: Record<string, unknown>;
}

export interface SkillGraph {
  id: number;
  entry: number;
  nodes: SkillNodeData[];
}

export class SkillGraphUtil {
  public static findNode(graph: SkillGraph, nodeId: number): SkillNodeData | undefined {
    return graph.nodes.find((node) => node.id === nodeId);
  }

  public static fromJSON(data: string): SkillGraph {
    return JSON.parse(data) as SkillGraph;
  }
}
