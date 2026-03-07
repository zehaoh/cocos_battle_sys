import type { SkillGraph } from './SkillGraph';

export const FireballSkillGraph: SkillGraph = {
  id: 1001,
  entry: 1,
  nodes: [
    {
      id: 1,
      type: 'Cast',
      next: [2],
    },
    {
      id: 2,
      type: 'SpawnProjectile',
      next: [3],
      params: {
        projectileId: 2001,
      },
    },
    {
      id: 3,
      type: 'Damage',
      next: [4],
      params: {
        damage: 16,
        ratio: 1.2,
      },
    },
    {
      id: 4,
      type: 'AddBuff',
      next: [],
      params: {
        buffId: 'burn',
        toTarget: true,
      },
    },
  ],
};
