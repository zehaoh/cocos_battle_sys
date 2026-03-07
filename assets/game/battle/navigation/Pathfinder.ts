import type { NavPoint } from './Path';

export interface Navigator {
  requestPath(start: NavPoint, goal: NavPoint): NavPoint[];
}

export class Pathfinder {
  constructor(private readonly navigator: Navigator) {}

  public requestPath(start: NavPoint, goal: NavPoint): NavPoint[] {
    return this.navigator.requestPath(start, goal);
  }
}
