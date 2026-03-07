import { StatsComponent } from '../../components/StatsComponent';

export function applySlow(world: import('../../../core/ecs/World').World, ownerId: number, ratio: number): void {
  const entity = world.entityManager.get(ownerId);
  if (!entity) return;
  const stats = entity.getComponent<StatsComponent>('Stats');
  if (!stats) return;
  stats.moveSpeed = Math.max(0.1, stats.moveSpeed * (1 - ratio));
}
