import { System } from '../core/ecs/System';
import { SystemPriority } from '../core/ecs/SystemPriority';
import { TransformComponent } from '../battle/components/TransformComponent';
import { PathComponent } from '../battle/components/PathComponent';
import { StatsComponent } from '../battle/components/StatsComponent';
import { Vec2Util } from '../core/math/Vec2';

export class NavigationSystem extends System {
  constructor() { super(SystemPriority.NAVIGATION); }

  public update(dt: number): void {
    for (const entity of this.world.query(['Transform', 'Path', 'Stats'])) {
      const tr = entity.getComponent<TransformComponent>('Transform');
      const path = entity.getComponent<PathComponent>('Path');
      const stats = entity.getComponent<StatsComponent>('Stats');
      if (!tr || !path || !stats || path.index >= path.path.length) continue;
      const target = path.path[path.index];
      const dir = Vec2Util.norm(Vec2Util.sub(target, tr.position));
      tr.position = Vec2Util.add(tr.position, Vec2Util.mul(dir, stats.moveSpeed * dt));
      if (Vec2Util.dist(tr.position, target) < 0.15) path.index += 1;
    }
  }
}
