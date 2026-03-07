import type { NavPoint } from './Path';

export interface AStarNode {
  x: number;
  y: number;
  walkable: boolean;
}

interface SearchNode {
  x: number;
  y: number;
  g: number;
  h: number;
  f: number;
  parent?: SearchNode;
}

export class AStar {
  public static findPath(
    start: NavPoint,
    goal: NavPoint,
    isWalkable: (x: number, y: number) => boolean,
    neighbors: (x: number, y: number) => NavPoint[],
  ): NavPoint[] {
    const open: SearchNode[] = [{ x: start.x, y: start.y, g: 0, h: this.h(start, goal), f: this.h(start, goal) }];
    const closed = new Set<string>();

    while (open.length > 0) {
      open.sort((a, b) => a.f - b.f);
      const current = open.shift() as SearchNode;
      if (current.x === goal.x && current.y === goal.y) {
        return this.reconstruct(current);
      }

      closed.add(`${current.x}:${current.y}`);
      for (const n of neighbors(current.x, current.y)) {
        if (!isWalkable(n.x, n.y)) continue;
        const key = `${n.x}:${n.y}`;
        if (closed.has(key)) continue;

        const g = current.g + 1;
        const existing = open.find((o) => o.x === n.x && o.y === n.y);
        if (!existing || g < existing.g) {
          const h = this.h(n, goal);
          const node: SearchNode = {
            x: n.x,
            y: n.y,
            g,
            h,
            f: g + h,
            parent: current,
          };

          if (!existing) open.push(node);
          else Object.assign(existing, node);
        }
      }
    }

    return [];
  }

  private static h(a: NavPoint, b: NavPoint): number {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  }

  private static reconstruct(node: SearchNode): NavPoint[] {
    const out: NavPoint[] = [];
    let cursor: SearchNode | undefined = node;
    while (cursor) {
      out.push({ x: cursor.x, y: cursor.y });
      cursor = cursor.parent;
    }
    out.reverse();
    return out;
  }
}
