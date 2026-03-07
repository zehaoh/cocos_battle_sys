import type { World } from '../../core/ecs/World';
import type { Blackboard } from './Blackboard';

export interface AIContext {
  world: World;
  entityId: number;
  targetId: number | null;
  position: { x: number; y: number };
  time: number;
  blackboard: Blackboard;
  canAttack: boolean;
  hasTarget: boolean;
  shouldRetreat: boolean;
  setState(state: 'Idle' | 'Chase' | 'Attack' | 'Retreat'): void;
  setMoveTarget(x: number, y: number): void;
}
