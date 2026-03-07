export type SkillConfig = {
  id: string;
  entry: string;
  nodes: Array<{ id: string; type: 'PlayAnimation' | 'SpawnHitbox' | 'ApplyDamage' | 'ApplyBuff'; next?: string[]; params?: Record<string, unknown> }>;
};

export type MonsterConfig = {
  id: string;
  hp: number;
  attack: number;
  defense: number;
  speed: number;
};

export type BuffConfig = {
  id: string;
  type: 'Poison' | 'Stun' | 'Slow' | 'Shield';
  duration: number;
  magnitude: number;
};
