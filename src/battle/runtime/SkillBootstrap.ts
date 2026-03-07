import type { SkillGraph } from '../skill/SkillGraph';
import { SkillNodeType } from '../skill/SkillNode';

export const DEFAULT_SKILLS: SkillGraph[] = [
  {
    id: 'slash',
    entry: '1',
    nodes: [
      { id: '1', type: SkillNodeType.PlayAnimation, next: ['2'] },
      { id: '2', type: SkillNodeType.SpawnHitbox, next: ['3'] },
      { id: '3', type: SkillNodeType.ApplyDamage },
    ],
  },
  {
    id: 'poison_strike',
    entry: '1',
    nodes: [
      { id: '1', type: SkillNodeType.PlayAnimation, next: ['2'] },
      { id: '2', type: SkillNodeType.ApplyDamage, next: ['3'] },
      { id: '3', type: SkillNodeType.ApplyBuff, params: { buffId: 'Poison' } },
    ],
  },
];
