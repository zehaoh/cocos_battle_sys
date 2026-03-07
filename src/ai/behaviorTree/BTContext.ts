export interface BTContext {
  selfId: number;
  targetId: number | null;
  world: import('../../core/ecs/World').World;
  deltaTime: number;
}
