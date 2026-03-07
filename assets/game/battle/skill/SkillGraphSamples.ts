import type { SkillGraph } from './SkillGraph';

export const FireballSkillGraph: SkillGraph = {
  id: 1001,
  entry: 1,
  nodes: [
    { id: 1, type: 'Cast' },
    {
      id: 2,
      type: 'SpawnProjectile',
      params: { projectileId: 2001 },
    },
    {
      id: 3,
      type: 'Damage',
      params: { damage: 16, ratio: 1.2 },
    },
    {
      id: 4,
      type: 'AddBuff',
      params: { buffId: 'burn', toTarget: true },
    },
  ],
  edges: [
    { from: 1, to: 2 },
    { from: 2, to: 3 },
    { from: 3, to: 4 },
  ],
};
