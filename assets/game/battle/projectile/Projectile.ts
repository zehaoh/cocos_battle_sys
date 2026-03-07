import type { ProjectileType } from '../components/ProjectileComponent';

export interface ProjectileConfig {
  ownerId: number;
  targetId: number;
  speed: number;
  damage: number;
  hitRadius?: number;
  projectileType?: ProjectileType;
  pierceLeft?: number;
  splitCount?: number;
  bounceLeft?: number;
}
