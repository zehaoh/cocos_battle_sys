export class FrameClock {
  private readonly values: unknown[] = [];

  public add(v: unknown): void { this.values.push(v); }
  public getAll(): unknown[] { return [...this.values]; }
  public size(): number { return this.values.length; }
  public reset(): void { this.values.length = 0; }
}
