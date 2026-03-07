import type { BattleWorld } from '../BattleWorld';
import type { BuffStackPolicy } from './BuffStackRule';

export type BuffEffectType = 'StatModifier' | 'DOT' | 'Shield' | 'Control' | 'Trigger';

export interface Buff {
  id: string;
  maxStacks: number;
  duration: number;
  tickPeriod: number;
  stackPolicy?: BuffStackPolicy;
  effectType?: BuffEffectType;
  onApply?(world: BattleWorld, entityId: number, stacks: number): void;
  onTick?(world: BattleWorld, entityId: number, stacks: number): void;
  onExpire?(world: BattleWorld, entityId: number): void;
}
