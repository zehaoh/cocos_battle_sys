import type { Buff } from './Buff';

export class BuffFactory {
  private readonly registry = new Map<string, Buff>();

  public register(buff: Buff): void {
    this.registry.set(buff.id, buff);
  }

  public create(buffId: string): Buff {
    const buff = this.registry.get(buffId);
    if (!buff) throw new Error(`Unknown buff ${buffId}`);
    return buff;
  }
}
