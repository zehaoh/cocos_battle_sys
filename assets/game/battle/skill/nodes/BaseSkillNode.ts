import type { SkillContext, SkillNode, SkillNodeResult } from '../SkillNode';
import type { SkillNodeData } from '../SkillGraph';

export abstract class BaseSkillNode implements SkillNode {
  public abstract execute(node: SkillNodeData, ctx: SkillContext): SkillNodeResult | void;

  protected numberParam(node: SkillNodeData, key: string, fallback = 0): number {
    const value = node.params?.[key];
    return typeof value === 'number' ? value : fallback;
  }

  protected boolParam(node: SkillNodeData, key: string, fallback = false): boolean {
    const value = node.params?.[key];
    return typeof value === 'boolean' ? value : fallback;
  }

  protected stringParam(node: SkillNodeData, key: string, fallback = ''): string {
    const value = node.params?.[key];
    return typeof value === 'string' ? value : fallback;
  }
}
