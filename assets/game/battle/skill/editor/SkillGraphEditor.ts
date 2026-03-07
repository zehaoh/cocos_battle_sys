import type { SkillEdge, SkillGraphAsset, SkillNodeData } from '../SkillGraph';

export class SkillGraphEditor {
  private readonly nodes = new Map<number, SkillNodeData>();
  private readonly edges: SkillEdge[] = [];

  public addNode(node: SkillNodeData): void {
    this.nodes.set(node.id, node);
  }

  public connect(from: number, to: number): void {
    this.edges.push({ from, to });
  }

  public export(graphId: number, entry: number): SkillGraphAsset {
    return {
      id: graphId,
      entry,
      nodes: [...this.nodes.values()],
      edges: [...this.edges],
    };
  }
}
