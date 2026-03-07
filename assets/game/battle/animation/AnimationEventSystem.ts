import { System } from '../../core/ecs/System';
import type { World } from '../../core/ecs/World';
import type { AnimationEvent } from './AnimationEvent';
import { AnimationEventComponent } from './AnimationEventComponent';
import { AnimationEventDispatcher } from './AnimationEventDispatcher';

interface AnimationPlayRequest {
  entityId: number;
  events: AnimationEvent[];
  targetId: number | null;
  skillId?: number;
}

export class AnimationEventSystem extends System {
  private readonly dispatcher = new AnimationEventDispatcher();
  private readonly unsubscribers: Array<() => void> = [];

  constructor(private readonly frameRate = 30) {
    super(35);
  }

  public override onAttach(world: World): void {
    this.unsubscribers.push(
      world.eventBus.on('animationPlayRequest', (payload) => this.onPlayRequest(world, payload as AnimationPlayRequest)),
    );
  }

  public override onDetach(): void {
    while (this.unsubscribers.length > 0) {
      const off = this.unsubscribers.pop() as () => void;
      off();
    }
  }

  public update(world: World, dt: number): void {
    const frameStep = Math.max(1, Math.floor(dt * this.frameRate));

    for (const entity of world.query(['AnimationEvent'])) {
      const anim = entity.get<AnimationEventComponent>('AnimationEvent') as AnimationEventComponent;
      if (!anim.playing || anim.events.length === 0) continue;

      for (let i = 0; i < frameStep; i++) {
        anim.currentFrame += 1;
        for (const event of anim.events) {
          if (event.frame === anim.currentFrame) {
            this.dispatcher.dispatch(world, entity.id, event);
          }
        }
      }
    }
  }

  private onPlayRequest(world: World, req: AnimationPlayRequest): void {
    const entity = world.getEntity(req.entityId);
    const anim = entity?.get<AnimationEventComponent>('AnimationEvent');
    if (!anim) return;

    anim.events = req.events.slice().sort((a, b) => a.frame - b.frame);
    anim.currentFrame = 0;
    anim.playing = true;
    anim.targetId = req.targetId;
    anim.skillId = req.skillId ?? 0;
  }
}
