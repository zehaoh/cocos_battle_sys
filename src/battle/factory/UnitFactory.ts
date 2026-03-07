import type { World } from '../../core/ecs/World';
import { HealthComponent } from '../components/HealthComponent';
import { StatsComponent } from '../components/StatsComponent';
import { TransformComponent } from '../components/TransformComponent';
import { SkillBookComponent } from '../components/SkillBookComponent';
import { AnimationComponent } from '../components/AnimationComponent';

export class UnitFactory {
  constructor(private readonly world: World) {}

  public createPlayer(): number {
    const e = this.world.entityManager.create();
    e.addComponent(new TransformComponent({ x: 2, y: 2 }));
    e.addComponent(new HealthComponent(200, 200));
    e.addComponent(new StatsComponent(16, 6, 0.2, 1.5, 2.8));
    e.addComponent(new SkillBookComponent(['slash', 'poison_strike']));
    e.addComponent(new AnimationComponent());
    return e.id;
  }

  public createMonster(x: number, y: number): number {
    const e = this.world.entityManager.create();
    e.addComponent(new TransformComponent({ x, y }));
    e.addComponent(new HealthComponent(120, 120));
    e.addComponent(new StatsComponent(10, 4, 0.1, 1.35, 2.2));
    e.addComponent(new AnimationComponent());
    return e.id;
  }
}
