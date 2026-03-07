import { GridNav } from './GridNav';

export interface GridPoint { x: number; y: number; }

export class AStar {
  public static find(nav: GridNav, start: GridPoint, goal: GridPoint): GridPoint[] {
    const open: GridPoint[] = [start];
    const parent = new Map<string, GridPoint>();
    const g = new Map<string, number>([[`${start.x},${start.y}`, 0]]);
    const h = (a: GridPoint, b: GridPoint) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

    while (open.length) {
      open.sort((a, b) => (g.get(`${a.x},${a.y}`) ?? 99999) + h(a, goal) - ((g.get(`${b.x},${b.y}`) ?? 99999) + h(b, goal)));
      const cur = open.shift()!;
      if (cur.x === goal.x && cur.y === goal.y) {
        const out: GridPoint[] = [cur];
        let key = `${cur.x},${cur.y}`;
        while (parent.has(key)) {
          const p = parent.get(key)!;
          out.push(p);
          key = `${p.x},${p.y}`;
        }
        return out.reverse();
      }

      for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]) {
        const nx = cur.x + dx;
        const ny = cur.y + dy;
        if (!nav.walkable(nx, ny)) continue;
        const nk = `${nx},${ny}`;
        const ng = (g.get(`${cur.x},${cur.y}`) ?? 0) + 1;
        if (ng < (g.get(nk) ?? 99999)) {
          g.set(nk, ng);
          parent.set(nk, cur);
          if (!open.some((p) => p.x === nx && p.y === ny)) open.push({ x: nx, y: ny });
        }
      }
    }
    return [];
  }
}
