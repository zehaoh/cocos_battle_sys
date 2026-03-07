import type { SkillContext } from './SkillContext';

export enum NodeResult {
  SUCCESS = 'SUCCESS',
  FAIL = 'FAIL',
  RUNNING = 'RUNNING',
}

export interface SkillNode {
  id: string;
  type: string;
  execute(ctx: SkillContext): NodeResult;
}
