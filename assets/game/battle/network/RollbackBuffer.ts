export interface RollbackState {
  tick: number;
  state: Record<string, unknown>;
}

export class RollbackBuffer {
  private readonly states: RollbackState[] = [];

  constructor(private readonly capacity = 180) {}

  public push(state: RollbackState): void {
    this.states.push(state);
    if (this.states.length > this.capacity) {
      this.states.shift();
    }
  }

  public get(tick: number): RollbackState | null {
    return this.states.find((s) => s.tick === tick) ?? null;
  }

  public latest(): RollbackState | null {
    return this.states.at(-1) ?? null;
  }
}
