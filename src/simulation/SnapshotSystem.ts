export interface Snapshot {
  frame: number;
  entities: Array<{ id: number; hp?: number; x?: number; y?: number }>;
}

export class SnapshotSystem {
  private readonly snapshots: Snapshot[] = [];
  public add(snapshot: Snapshot): void { this.snapshots.push(snapshot); }
  public all(): Snapshot[] { return [...this.snapshots]; }
}
