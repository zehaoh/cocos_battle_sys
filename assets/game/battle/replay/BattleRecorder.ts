export interface BattleEvent {
  tick: number;
  type: string;
  payload: Record<string, unknown>;
}

export class BattleRecorder {
  private readonly events: BattleEvent[] = [];

  public record(tick: number, type: string, payload: Record<string, unknown>): void {
    this.events.push({ tick, type, payload });
  }

  public dump(): BattleEvent[] {
    return this.events.map((e) => ({ ...e, payload: { ...e.payload } }));
  }

  public clear(): void {
    this.events.length = 0;
  }
}
