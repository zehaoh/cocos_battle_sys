import type { BattleEvent } from './BattleRecorder';

export class BattleReplay {
  constructor(private readonly events: BattleEvent[]) {}

  public getEventsAtTick(tick: number): BattleEvent[] {
    return this.events.filter((event) => event.tick === tick);
  }
}
