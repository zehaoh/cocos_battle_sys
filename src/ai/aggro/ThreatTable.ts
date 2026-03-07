export class ThreatTable {
  private readonly data = new Map<number, number>();
  public add(id: number, value: number): void { this.data.set(id, (this.data.get(id) ?? 0) + value); }
  public decay(ratio: number): void { for (const [k, v] of this.data) this.data.set(k, v * ratio); }
  public top(): number | null {
    let best: number | null = null;
    let bestV = -Infinity;
    for (const [k, v] of this.data) { if (v > bestV) { bestV = v; best = k; } }
    return best;
  }
}
