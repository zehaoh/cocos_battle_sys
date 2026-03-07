export interface TimerTask {
  id: number;
  remaining: number;
  interval: number;
  repeat: boolean;
  callback: () => void;
}

export class TimerService {
  private nextId = 1;
  private readonly tasks = new Map<number, TimerTask>();

  public once(delay: number, callback: () => void): number {
    return this.addTask(delay, false, callback);
  }

  public every(interval: number, callback: () => void): number {
    return this.addTask(interval, true, callback);
  }

  public cancel(id: number): void {
    this.tasks.delete(id);
  }

  public update(dt: number): void {
    for (const task of this.tasks.values()) {
      task.remaining -= dt;
      if (task.remaining > 0) continue;

      task.callback();
      if (task.repeat) {
        task.remaining += task.interval;
      } else {
        this.tasks.delete(task.id);
      }
    }
  }

  private addTask(interval: number, repeat: boolean, callback: () => void): number {
    const id = this.nextId++;
    this.tasks.set(id, {
      id,
      remaining: interval,
      interval,
      repeat,
      callback,
    });
    return id;
  }
}
