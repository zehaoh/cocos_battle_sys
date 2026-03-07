import type { Vec2 } from './MathUtil';

export class SpatialHash<T> {
  private readonly buckets = new Map<string, Set<T>>();

  constructor(private readonly cellSize: number) {}

  public clear(): void {
    this.buckets.clear();
  }

  public insert(position: Vec2, value: T): void {
    const key = this.key(position);
    let bucket = this.buckets.get(key);
    if (!bucket) {
      bucket = new Set<T>();
      this.buckets.set(key, bucket);
    }
    bucket.add(value);
  }

  public query(position: Vec2, radius: number): T[] {
    const out: T[] = [];
    const minX = Math.floor((position.x - radius) / this.cellSize);
    const maxX = Math.floor((position.x + radius) / this.cellSize);
    const minY = Math.floor((position.y - radius) / this.cellSize);
    const maxY = Math.floor((position.y + radius) / this.cellSize);

    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        const bucket = this.buckets.get(`${x}:${y}`);
        if (!bucket) continue;
        for (const item of bucket) out.push(item);
      }
    }

    return out;
  }

  private key(position: Vec2): string {
    return `${Math.floor(position.x / this.cellSize)}:${Math.floor(position.y / this.cellSize)}`;
  }
}
