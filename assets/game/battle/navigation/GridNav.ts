import { AStar } from './AStar';
import type { NavPoint } from './Path';

export class GridNav {
  private readonly blocked = new Set<string>();

  constructor(public readonly width: number, public readonly height: number) {}

  public block(x: number, y: number): void {
    this.blocked.add(`${x}:${y}`);
  }

  public unblock(x: number, y: number): void {
    this.blocked.delete(`${x}:${y}`);
  }

  public requestPath(start: NavPoint, goal: NavPoint): NavPoint[] {
    return AStar.findPath(
      { x: Math.round(start.x), y: Math.round(start.y) },
      { x: Math.round(goal.x), y: Math.round(goal.y) },
      (x, y) => x >= 0 && y >= 0 && x < this.width && y < this.height && !this.blocked.has(`${x}:${y}`),
      (x, y) => [
        { x: x + 1, y },
        { x: x - 1, y },
        { x, y: y + 1 },
        { x, y: y - 1 },
      ],
    );
  }
}
