export class ObjectPool<T> {
  private readonly free: T[] = [];

  constructor(
    private readonly factory: () => T,
    private readonly reset?: (obj: T) => void,
  ) {}

  public acquire(): T {
    return this.free.pop() ?? this.factory();
  }

  public release(obj: T): void {
    this.reset?.(obj);
    this.free.push(obj);
  }

  public size(): number {
    return this.free.length;
  }
}
