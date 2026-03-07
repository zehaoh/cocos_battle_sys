export type EventHandler<TPayload> = (payload: TPayload) => void;

export class EventBus<TEvents extends Record<string, unknown>> {
  private readonly handlers = new Map<keyof TEvents, Set<EventHandler<unknown>>>();
  private readonly queue: Array<{ event: keyof TEvents; payload: unknown }> = [];

  public on<K extends keyof TEvents>(event: K, handler: EventHandler<TEvents[K]>): () => void {
    let set = this.handlers.get(event);
    if (!set) {
      set = new Set<EventHandler<unknown>>();
      this.handlers.set(event, set);
    }

    set.add(handler as EventHandler<unknown>);
    return () => this.off(event, handler);
  }

  public off<K extends keyof TEvents>(event: K, handler: EventHandler<TEvents[K]>): void {
    this.handlers.get(event)?.delete(handler as EventHandler<unknown>);
  }

  public emit<K extends keyof TEvents>(event: K, payload: TEvents[K]): void {
    this.queue.push({ event, payload });
  }

  public flush(): void {
    while (this.queue.length > 0) {
      const { event, payload } = this.queue.shift() as { event: keyof TEvents; payload: unknown };
      const set = this.handlers.get(event);
      if (!set) continue;

      for (const handler of set) {
        (handler as EventHandler<unknown>)(payload);
      }
    }
  }

  public clear(): void {
    this.handlers.clear();
    this.queue.length = 0;
  }
}
