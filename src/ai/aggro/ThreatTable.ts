export class ThreatTable {
  public readonly threat = new Map<number, number>();

  public add(entityId: number, value: number): void {
    this.threat.set(entityId, (this.threat.get(entityId) ?? 0) + value);
  }

  public getHighestThreatTarget(): number | undefined {
    let maxTarget: number | undefined;
    let maxThreat = -Infinity;
    for (const [entityId, value] of this.threat) {
      if (value > maxThreat) {
        maxThreat = value;
        maxTarget = entityId;
      }
    }
    return maxTarget;
  }
}
