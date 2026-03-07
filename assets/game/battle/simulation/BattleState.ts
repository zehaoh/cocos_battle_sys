export interface UnitState {
  id: number;
  alive: boolean;
  hp?: number;
  x?: number;
  y?: number;
}

export interface BattleState {
  frame: number;
  units: UnitState[];
}
