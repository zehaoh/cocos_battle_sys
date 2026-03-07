import type { ProjectileBehavior } from './ProjectileBehavior';

export class LinearBehavior implements ProjectileBehavior {
  onSpawn(): void {}
  onUpdate(_dt: number): void {}
  onHit(_target: number): void {}
}

export class HomingBehavior implements ProjectileBehavior {
  onSpawn(): void {}
  onUpdate(_dt: number): void {}
  onHit(_target: number): void {}
}

export class BounceBehavior implements ProjectileBehavior {
  onSpawn(): void {}
  onUpdate(_dt: number): void {}
  onHit(_target: number): void {}
}

export class PierceBehavior implements ProjectileBehavior {
  onSpawn(): void {}
  onUpdate(_dt: number): void {}
  onHit(_target: number): void {}
}

export class SplitBehavior implements ProjectileBehavior {
  onSpawn(): void {}
  onUpdate(_dt: number): void {}
  onHit(_target: number): void {}
}

export class ExplosionBehavior implements ProjectileBehavior {
  onSpawn(): void {}
  onUpdate(_dt: number): void {}
  onHit(_target: number): void {}
}
