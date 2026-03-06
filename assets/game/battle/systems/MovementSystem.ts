import { System } from '../../core/ecs/System';
import type { World } from '../../core/ecs/World';
import { MathUtil } from '../../core/math/MathUtil';
import { MoveComponent } from '../components/MoveComponent';
import { TransformComponent } from '../components/TransformComponent';

export class MovementSystem extends System {
  constructor() {
    super(10);
  }

  public update(world: World, dt: number): void {
    for (const entity of world.query(['Transform', 'Move'])) {
      const transform = entity.get<TransformComponent>('Transform') as TransformComponent;
      const move = entity.get<MoveComponent>('Move') as MoveComponent;
      if (!move.moving) continue;

      const dx = move.destinationX - transform.x;
      const dy = move.destinationY - transform.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= 0.001) {
        move.moving = false;
        continue;
      }

      const dir = MathUtil.normalize({ x: dx, y: dy });
      const step = Math.min(dist, move.speed * dt);
      transform.x += dir.x * step;
      transform.y += dir.y * step;
      transform.rotation = Math.atan2(dir.y, dir.x);
      if (step >= dist) move.moving = false;
    }
  }
}
