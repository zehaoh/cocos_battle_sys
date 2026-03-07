export type EventHandler<T = unknown> = (payload: T) => void;

type Listener = { handler: EventHandler; priority: number; once: boolean };

export class EventBus {
  private readonly listeners = new Map<string, Listener[]>();

  public on(event: string, handler: EventHandler, priority = 0): () => void {
    const list = this.listeners.get(event) ?? [];
    list.push({ handler, priority, once: false });
    list.sort((a, b) => b.priority - a.priority);
    this.listeners.set(event, list);
    return () => this.off(event, handler);
  }

  public once(event: string, handler: EventHandler, priority = 0): () => void {
    const list = this.listeners.get(event) ?? [];
    list.push({ handler, priority, once: true });
    list.sort((a, b) => b.priority - a.priority);
    this.listeners.set(event, list);
    return () => this.off(event, handler);
  }

  public off(event: string, handler: EventHandler): void {
    const list = this.listeners.get(event);
    if (!list) return;
    this.listeners.set(event, list.filter((l) => l.handler !== handler));
  }

  public emit<T = unknown>(event: string, payload: T): void {
    const list = this.listeners.get(event);
    if (!list || list.length === 0) return;
    const onceHandlers: EventHandler[] = [];
    for (const listener of list) {
      listener.handler(payload);
      if (listener.once) onceHandlers.push(listener.handler);
    }
    for (const handler of onceHandlers) this.off(event, handler);
  }
}
