export class SimulationClock {
  private accumulator = 0;
  private frame = 0;

  constructor(public readonly fixedStep = 1 / 30) {}

  public consumeFrames(dt: number): number {
    this.accumulator += Math.max(0, dt);
    let frames = 0;
    while (this.accumulator >= this.fixedStep) {
      this.accumulator -= this.fixedStep;
      this.frame += 1;
      frames += 1;
    }
    return frames;
  }

  public getFrame(): number {
    return this.frame;
  }

  public reset(): void {
    this.accumulator = 0;
    this.frame = 0;
  }
}
