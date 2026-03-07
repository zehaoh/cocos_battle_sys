import type { ProjectileBehavior } from '../components/ProjectileComponent';

export interface ProjectileConfig {
  id: number;
  speed: number;
  lifeTime: number;
  radius: number;
  penetrate: number;
  behavior: ProjectileBehavior;
  damage: number;
  bounce?: number;
  split?: number;
}

export interface SpawnProjectileRequest {
  projectileId: number;
  casterId: number;
  targetId: number | null;
}
