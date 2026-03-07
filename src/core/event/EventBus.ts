export type EventHandler<T = unknown> = (payload: T) => void;

type Listener = {
  handler: EventHandler;
  once: boolean;
  priority: number;
};

export class EventBus {
  private readonly listeners = new Map<string, Listener[]>();

  public on(event: string, handler: EventHandler, priority = 0): () => void {
    const list = this.listeners.get(event) ?? [];
    list.push({ handler, once: false, priority });
    list.sort((a, b) => b.priority - a.priority);
    list.sort((a, b) => b.priority - a.priority);
    this.listeners.set(event, list);
    return () => this.off(event, handler);
  }

  public once(event: string, handler: EventHandler, priority = 0): () => void {
    const list = this.listeners.get(event) ?? [];
    list.push({ handler, once: true, priority });
    list.sort((a, b) => b.priority - a.priority);
    this.listeners.set(event, list);
    return () => this.off(event, handler);
  }

  public off(event: string, handler: EventHandler): void {
    const list = this.listeners.get(event);
    if (!list) return;
    this.listeners.set(event, list.filter((listener) => listener.handler !== handler));
  }

  public emit(event: string, payload: unknown): void {
    const list = this.listeners.get(event);
    if (!list || list.length === 0) return;
    for (const listener of list) {
      listener.handler(payload);
      if (listener.once) {
        this.off(event, listener.handler);
      }
    }
  }
}
