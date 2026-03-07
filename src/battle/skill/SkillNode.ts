export enum SkillNodeType {
  PlayAnimation = 'PlayAnimation',
  SpawnHitbox = 'SpawnHitbox',
  ApplyDamage = 'ApplyDamage',
  ApplyBuff = 'ApplyBuff',
}

export interface SkillNode {
  id: string;
  type: SkillNodeType;
  next?: string[];
  params?: Record<string, unknown>;
}
