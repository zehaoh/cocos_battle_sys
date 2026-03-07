export interface Snapshot {
  tick: number;
  state: Record<string, unknown>;
}

export class ServerSync {
  private readonly snapshots: Snapshot[] = [];

  constructor(private readonly capacity = 120) {}

  public pushSnapshot(snapshot: Snapshot): void {
    this.snapshots.push(snapshot);
    if (this.snapshots.length > this.capacity) {
      this.snapshots.shift();
    }
  }

  public latest(): Snapshot | null {
    return this.snapshots.at(-1) ?? null;
  }

  public size(): number {
    return this.snapshots.length;
  }
}
