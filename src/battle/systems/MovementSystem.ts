import { PathComponent } from '../components/PathComponent';
import { StatsComponent } from '../components/StatsComponent';
import { TransformComponent } from '../components/TransformComponent';
import { Vec2Util } from '../../core/math/Vec2';
import { System } from '../../core/ecs/System';
import { SystemPriority } from '../../core/ecs/SystemPriority';

export class MovementSystem extends System {
  constructor() { super(SystemPriority.NAVIGATION - 10); }
  public update(dt: number): void {
    for (const entity of this.world.query(['Transform', 'Path', 'Stats'])) {
      const t = entity.getComponent<TransformComponent>('Transform');
      const p = entity.getComponent<PathComponent>('Path');
      const s = entity.getComponent<StatsComponent>('Stats');
      if (!t || !p || !s || p.index >= p.path.length) continue;
      const target = p.path[p.index];
      const dir = Vec2Util.norm(Vec2Util.sub(target, t.position));
      t.position = Vec2Util.add(t.position, Vec2Util.mul(dir, s.moveSpeed * dt));
      if (Vec2Util.dist(t.position, target) < 0.1) p.index += 1;
    }
  }
}
