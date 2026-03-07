import type { ProjectileBehavior } from './ProjectileBehavior';

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface ProjectileComponent {
  speed: number;
  direction: Vec3;
  behaviors: ProjectileBehavior[];
}
