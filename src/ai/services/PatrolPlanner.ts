export class PatrolPlanner {
  private readonly entries: string[] = [];

  public push(entry: string): void {
    this.entries.push(entry);
  }

  public latest(): string | undefined {
    return this.entries[this.entries.length - 1];
  }

  public all(): string[] {
    return [...this.entries];
  }

  public clear(): void {
    this.entries.length = 0;
  }
}
