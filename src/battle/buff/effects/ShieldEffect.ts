import { HealthComponent } from '../../components/HealthComponent';

export function applyShield(world: import('../../../core/ecs/World').World, ownerId: number, value: number): void {
  const entity = world.entityManager.get(ownerId);
  if (!entity) return;
  const hp = entity.getComponent<HealthComponent>('Health');
  if (!hp) return;
  hp.shield += value;
}
