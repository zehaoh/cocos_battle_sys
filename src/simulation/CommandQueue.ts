export interface Command {
  frame: number;
  type: string;
  entity: number;
  params?: Record<string, unknown>;
}

export class CommandQueue {
  private readonly queue: Command[] = [];

  public push(command: Command): void {
    this.queue.push(command);
  }

  public pop(frame: number): Command[] {
    const out = this.queue.filter((command) => command.frame === frame);
    for (const command of out) {
      const idx = this.queue.indexOf(command);
      if (idx >= 0) this.queue.splice(idx, 1);
    }
    return out;
  }
}
