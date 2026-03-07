import { RollbackBuffer } from './RollbackBuffer';
import type { Snapshot } from './ServerSync';

export interface ClientInput {
  tick: number;
  command: string;
  payload: Record<string, unknown>;
}

export class ClientPrediction {
  private readonly pendingInputs: ClientInput[] = [];
  private readonly rollbackBuffer = new RollbackBuffer();

  public pushInput(input: ClientInput): void {
    this.pendingInputs.push(input);
  }

  public recordPredictedState(tick: number, state: Record<string, unknown>): void {
    this.rollbackBuffer.push({ tick, state });
  }

  public reconcile(serverSnapshot: Snapshot): ClientInput[] {
    while (this.pendingInputs.length > 0 && this.pendingInputs[0].tick <= serverSnapshot.tick) {
      this.pendingInputs.shift();
    }

    const predicted = this.rollbackBuffer.get(serverSnapshot.tick);
    if (predicted) {
      const mismatch = JSON.stringify(predicted.state) !== JSON.stringify(serverSnapshot.state);
      if (mismatch) {
        return [...this.pendingInputs];
      }
    }

    return [...this.pendingInputs];
  }
}
