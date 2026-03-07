export interface GridNode { x: number; y: number; walkable: boolean }

export function findPath(start: GridNode, goal: GridNode, grid: GridNode[][]): GridNode[] {
  const open: GridNode[] = [start];
  const closed = new Set<string>();
  const parent = new Map<string, GridNode>();
  const k = (n: GridNode) => `${n.x},${n.y}`;

  while (open.length) {
    const current = open.shift()!;
    if (current.x === goal.x && current.y === goal.y) {
      const out: GridNode[] = [current];
      let cur = current;
      while (parent.has(k(cur))) {
        cur = parent.get(k(cur))!;
        out.push(cur);
      }
      return out.reverse();
    }
    closed.add(k(current));
    for (const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]) {
      const next = grid[current.y + dy]?.[current.x + dx];
      if (!next || !next.walkable || closed.has(k(next))) continue;
      if (!open.find((n) => n.x===next.x && n.y===next.y)) {
        parent.set(k(next), current);
        open.push(next);
      }
    }
  }
  return [];
}
