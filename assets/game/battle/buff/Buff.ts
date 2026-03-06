import type { BattleWorld } from '../BattleWorld';

export interface Buff {
  id: string;
  maxStacks: number;
  duration: number;
  tickPeriod: number;
  onApply?(world: BattleWorld, entityId: number, stacks: number): void;
  onTick?(world: BattleWorld, entityId: number, stacks: number): void;
  onExpire?(world: BattleWorld, entityId: number): void;
}
