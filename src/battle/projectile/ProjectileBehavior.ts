export interface ProjectileBehavior {
  onSpawn(projectileId: number): void;
  onUpdate(projectileId: number, dt: number): void;
  onHit(projectileId: number, targetId: number): void;
}
