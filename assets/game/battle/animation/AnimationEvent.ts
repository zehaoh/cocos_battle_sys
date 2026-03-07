export interface AnimationEvent {
  frame: number;
  type: 'spawn_hitbox' | 'damage' | 'end';
  params?: Record<string, unknown>;
}
