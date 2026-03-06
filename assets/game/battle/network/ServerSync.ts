export interface Snapshot {
  tick: number;
  state: Record<string, unknown>;
}

export class ServerSync {
  private readonly snapshots: Snapshot[] = [];

  public pushSnapshot(snapshot: Snapshot): void {
    this.snapshots.push(snapshot);
    if (this.snapshots.length > 120) {
      this.snapshots.shift();
    }
  }

  public latest(): Snapshot | null {
    return this.snapshots.at(-1) ?? null;
  }
}
