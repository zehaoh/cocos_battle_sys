export interface Command {
  frame: number;
  type: string;
  entity: number;
  params?: Record<string, unknown>;
}

export class CommandQueue {
  private readonly commands: Command[] = [];

  public push(command: Command): void {
    this.commands.push(command);
  }

  public pop(frame: number): Command[] {
    const ready = this.commands.filter((cmd) => cmd.frame === frame);
    if (ready.length === 0) return [];
    const remain = this.commands.filter((cmd) => cmd.frame !== frame);
    this.commands.length = 0;
    this.commands.push(...remain);
    return ready;
  }

  public clear(): void {
    this.commands.length = 0;
  }
}
