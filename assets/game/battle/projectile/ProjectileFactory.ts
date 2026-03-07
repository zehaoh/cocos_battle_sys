import type { World } from '../../core/ecs/World';
import { MathUtil } from '../../core/math/MathUtil';
import { ProjectileComponent } from '../components/ProjectileComponent';
import { TransformComponent } from '../components/TransformComponent';
import type { ProjectileConfig } from './Projectile';

export class ProjectileFactory {
  private readonly configs = new Map<number, ProjectileConfig>();

  constructor() {
    this.register({ id: 2001, speed: 10, lifeTime: 2.5, radius: 0.4, penetrate: 1, behavior: 'Homing', damage: 20 });
    this.register({ id: 2002, speed: 12, lifeTime: 2, radius: 0.35, penetrate: 2, behavior: 'Linear', damage: 14 });
    this.register({ id: 2003, speed: 9, lifeTime: 3, radius: 0.35, penetrate: 1, behavior: 'Bounce', damage: 16, bounce: 2 });
    this.register({ id: 2004, speed: 8, lifeTime: 2.2, radius: 0.35, penetrate: 1, behavior: 'Split', damage: 15, split: 2 });
  }

  public register(config: ProjectileConfig): void {
    this.configs.set(config.id, config);
  }

  public spawn(world: World, projectileId: number, casterId: number, targetId: number | null): number | null {
    const cfg = this.configs.get(projectileId);
    if (!cfg) return null;

    const caster = world.getEntity(casterId);
    const casterTransform = caster?.get<TransformComponent>('Transform');
    if (!casterTransform) return null;

    const target = targetId !== null ? world.getEntity(targetId) : null;
    const targetTransform = target?.get<TransformComponent>('Transform');
    const dir = targetTransform
      ? MathUtil.normalize({ x: targetTransform.x - casterTransform.x, y: targetTransform.y - casterTransform.y })
      : { x: 1, y: 0 };

    const entity = world.createEntity();
    world.addComponent(entity.id, new TransformComponent(casterTransform.x, casterTransform.y));
    world.addComponent(entity.id, new ProjectileComponent(
      cfg.id,
      casterId,
      targetId,
      cfg.speed,
      dir.x,
      dir.y,
      cfg.lifeTime,
      0,
      cfg.radius,
      cfg.penetrate,
      cfg.behavior,
      cfg.damage,
      cfg.bounce ?? 0,
      cfg.split ?? 0,
    ));

    return entity.id;
  }
}
