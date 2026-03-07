export interface Snapshot {
  frame: number;
  data: Record<string, unknown>;
}

export class SnapshotSystem {
  private readonly snapshots: Snapshot[] = [];

  public record(frame: number, data: Record<string, unknown>): void {
    this.snapshots.push({ frame, data });
  }

  public getAll(): Snapshot[] {
    return [...this.snapshots];
  }
}
