export interface DamageEvent {
  attacker: number;
  target: number;
  value: number;
  damageType: string;
}

export interface SkillCastEvent {
  caster: number;
  skillId: string;
  target?: number;
}

export interface BuffAddEvent {
  target: number;
  buffId: string;
  stacks: number;
}

export interface ProjectileHitEvent {
  projectile: number;
  caster: number;
  target: number;
}
