import { StatsComponent } from '../../components/StatsComponent';

export function applyStun(world: import('../../../core/ecs/World').World, ownerId: number, magnitude: number): void {
  const entity = world.entityManager.get(ownerId);
  if (!entity) return;
  const stats = entity.getComponent<StatsComponent>('Stats');
  if (!stats) return;
  stats.moveSpeed = Math.max(0, stats.moveSpeed - magnitude);
}
