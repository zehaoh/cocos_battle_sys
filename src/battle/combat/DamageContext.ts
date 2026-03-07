export interface DamageContext {
  attackerId: number;
  targetId: number;
  baseDamage: number;
  attack: number;
  defense: number;
  critChance: number;
  critMultiplier: number;
}
