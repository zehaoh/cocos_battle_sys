import { System } from '../../core/ecs/System';
import type { World } from '../../core/ecs/World';
import { MoveComponent } from '../components/MoveComponent';
import { TransformComponent } from '../components/TransformComponent';
import { NavMesh } from './NavMesh';

export class PathfindingSystem extends System {
  private readonly paths = new Map<number, { x: number; y: number }[]>();

  constructor(private readonly navMesh: NavMesh) {
    super(5);
  }

  public update(world: World, _dt: number): void {
    const units = world.query(['Move', 'Transform']);
    for (const entity of units) {
      const move = entity.get<MoveComponent>('Move') as MoveComponent;
      const transform = entity.get<TransformComponent>('Transform') as TransformComponent;
      if (!move.moving) continue;

      if (!this.paths.has(entity.id) || this.paths.get(entity.id)?.length === 0) {
        const path = this.navMesh.findPath(
          { x: transform.x, y: transform.y },
          { x: move.destinationX, y: move.destinationY },
        );
        this.paths.set(entity.id, path);
      }

      const path = this.paths.get(entity.id) ?? [];
      const next = path[0];
      if (next) {
        move.destinationX = next.x;
        move.destinationY = next.y;
        const dx = transform.x - next.x;
        const dy = transform.y - next.y;
        if (dx * dx + dy * dy < 0.1) {
          path.shift();
        }
      }
    }
  }
}
