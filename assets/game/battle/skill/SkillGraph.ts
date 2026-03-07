export interface SkillNodeData {
  id: number;
  type: string;
  params?: Record<string, unknown>;
  next?: number[]; // backward-compatible inline links
}

export interface SkillEdge {
  from: number;
  to: number;
}

export interface SkillGraph {
  id: number;
  entry: number;
  nodes: SkillNodeData[];
  edges: SkillEdge[];
}

export type SkillGraphAsset = SkillGraph;

export class SkillGraphUtil {
  public static findNode(graph: SkillGraph, nodeId: number): SkillNodeData | undefined {
    return graph.nodes.find((node) => node.id === nodeId);
  }

  public static nextNodeIds(graph: SkillGraph, nodeId: number): number[] {
    const byEdge = graph.edges.filter((edge) => edge.from === nodeId).map((edge) => edge.to);
    if (byEdge.length > 0) return byEdge;

    const node = SkillGraphUtil.findNode(graph, nodeId);
    return node?.next ?? [];
  }

  public static fromJSON(data: string): SkillGraph {
    const raw = JSON.parse(data) as Partial<SkillGraph>;
    return {
      id: raw.id ?? 0,
      entry: raw.entry ?? 0,
      nodes: raw.nodes ?? [],
      edges: raw.edges ?? [],
    };
  }
}
