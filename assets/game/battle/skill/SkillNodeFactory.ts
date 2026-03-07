import type { SkillNode } from './SkillNode';

export type SkillNodeCtor = new () => SkillNode;

export class SkillNodeFactory {
  private readonly nodes = new Map<string, SkillNodeCtor>();

  public register(type: string, ctor: SkillNodeCtor): void {
    this.nodes.set(type, ctor);
  }

  public create(type: string): SkillNode {
    const ctor = this.nodes.get(type);
    if (!ctor) {
      throw new Error(`Unknown skill node type: ${type}`);
    }
    return new ctor();
  }
}
