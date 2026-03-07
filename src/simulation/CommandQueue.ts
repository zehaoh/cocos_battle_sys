export interface Command {
  frame: number;
  type: string;
  entityId: number;
  params: Record<string, unknown>;
}

export class CommandQueue {
  private readonly queue: Command[] = [];
  public push(c: Command): void { this.queue.push(c); }
  public pop(frame: number): Command[] {
    const out = this.queue.filter((c) => c.frame === frame);
    for (const c of out) this.queue.splice(this.queue.indexOf(c), 1);
    return out;
  }
}
