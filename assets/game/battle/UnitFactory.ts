import type { World } from '../core/ecs/World';
import { AIComponent } from './components/AIComponent';
import { BuffComponent } from './components/BuffComponent';
import { CombatComponent } from './components/CombatComponent';
import { MoveComponent } from './components/MoveComponent';
import { SkillComponent } from './components/SkillComponent';
import { TargetComponent } from './components/TargetComponent';
import { TransformComponent } from './components/TransformComponent';

export interface UnitTemplate {
  team: number;
  hp: number;
  attack: number;
  defense: number;
  attackRange: number;
  moveSpeed: number;
  x: number;
  y: number;
  ai?: boolean;
}

export class UnitFactory {
  public createUnit(world: World, data: UnitTemplate): number {
    const entity = world.createEntity();

    world.addComponent(entity.id, new TransformComponent(data.x, data.y));
    world.addComponent(entity.id, new MoveComponent(data.moveSpeed, data.x, data.y, false));
    world.addComponent(entity.id, new CombatComponent(data.team, data.hp, data.hp, data.attack, data.defense, data.attackRange));
    world.addComponent(entity.id, new TargetComponent());
    world.addComponent(entity.id, new SkillComponent());
    world.addComponent(entity.id, new BuffComponent());
    if (data.ai) {
      world.addComponent(entity.id, new AIComponent());
    }

    return entity.id;
  }
}
