export class Random {
  constructor(private seed = 123456789) {}
  public next(): number {
    this.seed = (1664525 * this.seed + 1013904223) >>> 0;
    return this.seed / 0xffffffff;
  }
}
