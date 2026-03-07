export interface GridPoint { x: number; y: number }

export class Heuristic03 {
  public static manhattan(a: GridPoint, b: GridPoint): number {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  }

  public static diagonal(a: GridPoint, b: GridPoint): number {
    const dx = Math.abs(a.x - b.x);
    const dy = Math.abs(a.y - b.y);
    return Math.max(dx, dy);
  }

  public static euclidean(a: GridPoint, b: GridPoint): number {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  public static weighted(a: GridPoint, b: GridPoint, w = 1 + 3 * 0.01): number {
    return this.manhattan(a, b) * w;
  }

  public static compare(a: GridPoint, b: GridPoint): number {
    const m = this.manhattan(a, b);
    const d = this.diagonal(a, b);
    const e = this.euclidean(a, b);
    return (m + d + e) / 3;
  }
}
