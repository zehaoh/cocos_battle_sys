import type { Vec2 } from '../../core/math/MathUtil';

export interface NavNode {
  id: string;
  x: number;
  y: number;
  neighbors: string[];
}

export class NavMesh {
  private readonly nodes = new Map<string, NavNode>();

  public addNode(node: NavNode): void {
    this.nodes.set(node.id, node);
  }

  public getNode(id: string): NavNode | undefined {
    return this.nodes.get(id);
  }

  public findNearest(pos: Vec2): NavNode | null {
    let nearest: NavNode | null = null;
    let bestDist = Number.POSITIVE_INFINITY;
    for (const node of this.nodes.values()) {
      const dx = node.x - pos.x;
      const dy = node.y - pos.y;
      const d = dx * dx + dy * dy;
      if (d < bestDist) {
        bestDist = d;
        nearest = node;
      }
    }
    return nearest;
  }

  public findPath(startPos: Vec2, endPos: Vec2): Vec2[] {
    const start = this.findNearest(startPos);
    const end = this.findNearest(endPos);
    if (!start || !end) return [];

    const open = new Set<string>([start.id]);
    const cameFrom = new Map<string, string>();
    const gScore = new Map<string, number>([[start.id, 0]]);
    const fScore = new Map<string, number>([[start.id, this.heuristic(start, end)]]);

    while (open.size > 0) {
      const currentId = this.pickLowest(open, fScore);
      if (currentId === end.id) {
        return this.reconstruct(cameFrom, currentId).map((id) => {
          const node = this.nodes.get(id) as NavNode;
          return { x: node.x, y: node.y };
        });
      }

      open.delete(currentId);
      const current = this.nodes.get(currentId) as NavNode;
      for (const nextId of current.neighbors) {
        const next = this.nodes.get(nextId);
        if (!next) continue;

        const tentative = (gScore.get(currentId) ?? Infinity) + this.heuristic(current, next);
        if (tentative < (gScore.get(nextId) ?? Infinity)) {
          cameFrom.set(nextId, currentId);
          gScore.set(nextId, tentative);
          fScore.set(nextId, tentative + this.heuristic(next, end));
          open.add(nextId);
        }
      }
    }

    return [];
  }

  private pickLowest(open: Set<string>, fScore: Map<string, number>): string {
    let bestId = '';
    let best = Infinity;
    for (const id of open) {
      const score = fScore.get(id) ?? Infinity;
      if (score < best) {
        best = score;
        bestId = id;
      }
    }
    return bestId;
  }

  private heuristic(a: { x: number; y: number }, b: { x: number; y: number }): number {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  private reconstruct(cameFrom: Map<string, string>, currentId: string): string[] {
    const path = [currentId];
    let cursor: string | undefined = currentId;
    while (cursor && cameFrom.has(cursor)) {
      cursor = cameFrom.get(cursor);
      if (cursor) path.push(cursor);
    }
    path.reverse();
    return path;
  }
}
