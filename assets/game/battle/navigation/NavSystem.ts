import { System } from '../../core/ecs/System';
import type { World } from '../../core/ecs/World';
import { MathUtil } from '../../core/math/MathUtil';
import { MoveComponent } from '../components/MoveComponent';
import { TransformComponent } from '../components/TransformComponent';
import { Pathfinder } from './Pathfinder';
import { PathComponent } from './PathComponent';

export class NavSystem extends System {
  constructor(private readonly pathfinder: Pathfinder) {
    super(6);
  }

  public update(world: World, dt: number): void {
    for (const entity of world.query(['Transform', 'Move', 'Path'])) {
      const transform = entity.get<TransformComponent>('Transform') as TransformComponent;
      const move = entity.get<MoveComponent>('Move') as MoveComponent;
      const path = entity.get<PathComponent>('Path') as PathComponent;

      if (!move.moving) continue;

      if (path.path.length === 0 || path.currentIndex >= path.path.length) {
        path.path = this.pathfinder.requestPath(
          { x: transform.x, y: transform.y },
          { x: move.destinationX, y: move.destinationY },
        );
        path.currentIndex = 0;
      }

      const next = path.path[path.currentIndex];
      if (!next) continue;

      const dir = MathUtil.normalize({ x: next.x - transform.x, y: next.y - transform.y });
      transform.x += dir.x * path.speed * dt;
      transform.y += dir.y * path.speed * dt;

      if (MathUtil.distance(transform, next) < 0.15) {
        path.currentIndex += 1;
      }
    }
  }
}
