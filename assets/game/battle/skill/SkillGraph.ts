import type { SkillNode } from './SkillNode';

export class SkillGraph {
  public readonly nodes = new Map<string, SkillNode>();
  public readonly edges = new Map<string, string[]>();
  public entryNodeId: string | null = null;

  public addNode(node: SkillNode): this {
    this.nodes.set(node.id, node);
    if (!this.entryNodeId) this.entryNodeId = node.id;
    return this;
  }

  public addEdge(fromId: string, toId: string): this {
    const list = this.edges.get(fromId) ?? [];
    list.push(toId);
    this.edges.set(fromId, list);
    return this;
  }
}
