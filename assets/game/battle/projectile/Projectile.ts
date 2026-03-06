export interface ProjectileConfig {
  ownerId: number;
  targetId: number;
  speed: number;
  damage: number;
  hitRadius?: number;
  homing?: boolean;
}
