export enum EngineEvent {
  ATTACK = 'ATTACK',
  DAMAGE = 'DAMAGE',
  SKILL_CAST = 'SKILL_CAST',
  DEATH = 'DEATH',
  BUFF_ADD = 'BUFF_ADD',
  BUFF_REMOVE = 'BUFF_REMOVE',
  PROJECTILE_SPAWN = 'PROJECTILE_SPAWN',
  PROJECTILE_HIT = 'PROJECTILE_HIT',
  MOVE_COMMAND = 'MOVE_COMMAND',
}

export type AttackEvent = { attackerId: number; targetId: number; skillId?: string };
export type DamageEvent = { attackerId: number; targetId: number; amount: number; crit: boolean };
export type SkillCastEvent = { casterId: number; targetId: number; skillId: string };
export type DeathEvent = { deadId: number; killerId?: number };
