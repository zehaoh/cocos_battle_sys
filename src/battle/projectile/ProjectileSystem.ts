import { System } from '../../core/ecs/System';
import { SystemPriority } from '../../core/ecs/SystemPriority';
import { EngineEvent } from '../../core/event/EventTypes';
import { ProjectileComponent } from '../components/ProjectileComponent';
import { TransformComponent } from '../components/TransformComponent';
import { Vec2Util } from '../../core/math/Vec2';

export class ProjectileSystem extends System {
  constructor() { super(SystemPriority.PROJECTILE); }

  public onAttach(world: import('../../core/ecs/World').World): void {
    super.onAttach(world);
    this.world.eventBus.on(EngineEvent.PROJECTILE_SPAWN, (payload) => {
      const ev = payload as { casterId: number; targetId: number; speed: number; damage: number };
      const caster = this.world.entityManager.get(ev.casterId);
      const target = this.world.entityManager.get(ev.targetId);
      if (!caster || !target) return;
      const cPos = caster.getComponent<TransformComponent>('Transform');
      const tPos = target.getComponent<TransformComponent>('Transform');
      if (!cPos || !tPos) return;
      const dir = Vec2Util.norm(Vec2Util.sub(tPos.position, cPos.position));
      const p = this.world.entityManager.create();
      p.addComponent(new TransformComponent({ ...cPos.position }));
      p.addComponent(new ProjectileComponent(ev.casterId, ev.speed, dir, 3, 0.5, ev.damage, []));
    });
  }

  public update(dt: number): void {
    for (const projectileEntity of this.world.query(['Projectile', 'Transform'])) {
      const projectile = projectileEntity.getComponent<ProjectileComponent>('Projectile');
      const transform = projectileEntity.getComponent<TransformComponent>('Transform');
      if (!projectile || !transform) continue;

      projectile.age += dt;
      transform.position = Vec2Util.add(transform.position, Vec2Util.mul(projectile.direction, projectile.speed * dt));

      if (projectile.age >= projectile.lifeTime) {
        this.world.entityManager.remove(projectileEntity.id);
        continue;
      }

      for (const target of this.world.query(['Health', 'Transform'])) {
        if (target.id === projectile.casterId) continue;
        const tPos = target.getComponent<TransformComponent>('Transform');
        if (!tPos) continue;
        if (Vec2Util.dist(tPos.position, transform.position) <= projectile.radius) {
          this.world.eventBus.emit(EngineEvent.ATTACK, { attackerId: projectile.casterId, targetId: target.id });
          this.world.eventBus.emit(EngineEvent.PROJECTILE_HIT, { projectileId: projectileEntity.id, targetId: target.id });
          this.world.entityManager.remove(projectileEntity.id);
          break;
        }
      }
    }
  }
}
