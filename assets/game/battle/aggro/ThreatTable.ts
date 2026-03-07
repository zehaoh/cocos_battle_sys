export class ThreatTable {
  private readonly threat = new Map<number, number>();

  public add(entityId: number, value: number): void {
    if (value <= 0) return;
    const old = this.threat.get(entityId) ?? 0;
    this.threat.set(entityId, old + value);
  }

  public decay(multiplier: number): void {
    const factor = Math.max(0, Math.min(1, multiplier));
    for (const [entityId, value] of this.threat) {
      const next = value * factor;
      if (next < 0.001) {
        this.threat.delete(entityId);
      } else {
        this.threat.set(entityId, next);
      }
    }
  }

  public remove(entityId: number): void {
    this.threat.delete(entityId);
  }

  public clear(): void {
    this.threat.clear();
  }

  public getHighest(filter?: (entityId: number) => boolean): number | null {
    let max = 0;
    let target: number | null = null;

    for (const [id, value] of this.threat) {
      if (filter && !filter(id)) continue;
      if (value > max) {
        max = value;
        target = id;
      }
    }

    return target;
  }
}
