import type { Snapshot } from './ServerSync';

export interface ClientInput {
  tick: number;
  command: string;
  payload: Record<string, unknown>;
}

export class ClientPrediction {
  private readonly pendingInputs: ClientInput[] = [];

  public pushInput(input: ClientInput): void {
    this.pendingInputs.push(input);
  }

  public reconcile(serverSnapshot: Snapshot): ClientInput[] {
    while (this.pendingInputs.length > 0 && this.pendingInputs[0].tick <= serverSnapshot.tick) {
      this.pendingInputs.shift();
    }
    return [...this.pendingInputs];
  }
}
