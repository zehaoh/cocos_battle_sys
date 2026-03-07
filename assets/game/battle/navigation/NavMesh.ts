import type { NavPoint } from './Path';
import { NavMesh as LegacyNavMesh } from '../pathfinding/NavMesh';

export class NavMesh {
  constructor(private readonly navMesh: LegacyNavMesh) {}

  public requestPath(start: NavPoint, goal: NavPoint): NavPoint[] {
    return this.navMesh.findPath(start, goal);
  }
}
