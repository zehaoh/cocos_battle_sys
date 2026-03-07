export class GridNav {
  constructor(public readonly width: number, public readonly height: number, private readonly blocked = new Set<string>()) {}
  public key(x: number, y: number): string { return `${x},${y}`; }
  public block(x: number, y: number): void { this.blocked.add(this.key(x, y)); }
  public walkable(x: number, y: number): boolean {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) return false;
    return !this.blocked.has(this.key(x, y));
  }
}
