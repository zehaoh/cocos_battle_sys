export type InputCommand = CastSkillCommand | MoveCommand | TargetCommand;

export interface CastSkillCommand {
  type: 'CastSkill';
  casterId: number;
  skillId: string;
  targetId: number | null;
}

export interface MoveCommand {
  type: 'Move';
  entityId: number;
  x: number;
  y: number;
}

export interface TargetCommand {
  type: 'Target';
  entityId: number;
  targetId: number | null;
}
