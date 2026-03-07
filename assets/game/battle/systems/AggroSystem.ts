import { System } from '../../core/ecs/System';
import type { World } from '../../core/ecs/World';
import { SpatialHash } from '../../core/math/SpatialHash';
import { MathUtil } from '../../core/math/MathUtil';
import type { BattleWorld } from '../BattleWorld';
import { CombatComponent } from '../components/CombatComponent';
import { TargetComponent } from '../components/TargetComponent';
import { TransformComponent } from '../components/TransformComponent';

export class AggroSystem extends System {
  private readonly spatial = new SpatialHash<number>(4);

  constructor(
    private readonly battleWorld: BattleWorld,
    private readonly radius = 10,
  ) {
    super(15);
  }

  public update(world: World, _dt: number): void {
    this.spatial.clear();

    for (const entity of world.query(['Combat', 'Transform'])) {
      const transform = entity.get<TransformComponent>('Transform') as TransformComponent;
      this.spatial.insert(transform, entity.id);
    }

    for (const entity of world.query(['Combat', 'Transform', 'Target'])) {
      const combat = entity.get<CombatComponent>('Combat') as CombatComponent;
      const transform = entity.get<TransformComponent>('Transform') as TransformComponent;
      const target = entity.get<TargetComponent>('Target') as TargetComponent;
      if (!combat.alive) continue;

      const threatTarget = this.battleWorld.pickAggroTarget(entity.id);
      if (threatTarget !== null) {
        target.targetId = threatTarget;
        continue;
      }

      const nearby = this.spatial.query(transform, this.radius);
      let bestTarget: number | null = null;
      let bestDist = Number.POSITIVE_INFINITY;

      for (const otherId of nearby) {
        if (otherId === entity.id) continue;
        const otherEntity = world.getEntity(otherId);
        const otherCombat = otherEntity?.get<CombatComponent>('Combat');
        const otherTransform = otherEntity?.get<TransformComponent>('Transform');
        if (!otherCombat || !otherTransform || !otherCombat.alive) continue;
        if (otherCombat.team === combat.team) continue;

        const dist = MathUtil.distance(transform, otherTransform);
        if (dist < bestDist && dist <= this.radius) {
          bestDist = dist;
          bestTarget = otherId;
        }
      }

      target.targetId = bestTarget;
    }
  }
}
