import { System } from '../core/ecs/System';
import { SystemPriority } from '../core/ecs/SystemPriority';
import { AnimationComponent } from '../battle/components/AnimationComponent';
import { AnimationState } from './AnimationStateMachine';

export class AnimationSystem extends System {
  constructor() { super(SystemPriority.ANIMATION); }

  public onAttach(world: import('../core/ecs/World').World): void {
    super.onAttach(world);
    this.world.eventBus.on('ANIM_PLAY', (payload) => {
      const ev = payload as { entityId: number; state: keyof typeof AnimationState };
      const e = this.world.entityManager.get(ev.entityId);
      const c = e?.getComponent<AnimationComponent>('Animation');
      if (!c) return;
      c.machine.change(AnimationState[ev.state]);
    });
  }

  public update(dt: number): void {
    for (const entity of this.world.query(['Animation'])) {
      const comp = entity.getComponent<AnimationComponent>('Animation');
      comp?.machine.update(dt);
    }
  }
}
