export class Blackboard {
  private readonly data = new Map<string, unknown>();

  public set<T>(key: string, value: T): void {
    this.data.set(key, value);
  }

  public get<T>(key: string): T | undefined {
    return this.data.get(key) as T | undefined;
  }

  public has(key: string): boolean {
    return this.data.has(key);
  }

  public clear(): void {
    this.data.clear();
  }
}
