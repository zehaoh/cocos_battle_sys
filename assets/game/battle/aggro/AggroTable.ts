export class AggroTable {
  private readonly threatBySource = new Map<number, number>();
  private tauntTarget: number | null = null;

  public addThreat(sourceId: number, value: number): void {
    const current = this.threatBySource.get(sourceId) ?? 0;
    this.threatBySource.set(sourceId, current + Math.max(0, value));
  }

  public decay(rate: number): void {
    if (rate <= 0) return;
    for (const [sourceId, threat] of this.threatBySource) {
      const next = Math.max(0, threat - rate);
      if (next <= 0.0001) {
        this.threatBySource.delete(sourceId);
      } else {
        this.threatBySource.set(sourceId, next);
      }
    }
  }

  public setTaunt(targetId: number | null): void {
    this.tauntTarget = targetId;
  }

  public pickTarget(exists: (entityId: number) => boolean): number | null {
    if (this.tauntTarget !== null && exists(this.tauntTarget)) {
      return this.tauntTarget;
    }

    let bestId: number | null = null;
    let bestThreat = -1;

    for (const [sourceId, threat] of this.threatBySource) {
      if (!exists(sourceId)) continue;
      if (threat > bestThreat) {
        bestThreat = threat;
        bestId = sourceId;
      }
    }

    return bestId;
  }
}
