import { System } from '../../core/ecs/System';
import type { World } from '../../core/ecs/World';
import { BuffComponent } from '../components/BuffComponent';
import { CombatComponent } from '../components/CombatComponent';
import { MoveComponent } from '../components/MoveComponent';
import { StatComponent } from '../components/StatComponent';

export class StatSystem extends System {
  constructor() {
    super(12);
  }

  public update(world: World, _dt: number): void {
    for (const entity of world.query(['Stat', 'Combat', 'Move'])) {
      const stat = entity.get<StatComponent>('Stat') as StatComponent;
      const combat = entity.get<CombatComponent>('Combat') as CombatComponent;
      const move = entity.get<MoveComponent>('Move') as MoveComponent;
      const buff = entity.get<BuffComponent>('Buff');

      let attackScale = 1;
      let defenseScale = 1;
      for (const b of buff?.buffs.values() ?? []) {
        if (b.id === 'rage') attackScale += 0.05 * b.stacks;
        if (b.id === 'guard') defenseScale += 0.06 * b.stacks;
      }

      stat.finalAttack = Math.floor(stat.baseAttack * attackScale);
      stat.finalDefense = Math.floor(stat.baseDefense * defenseScale);
      stat.finalCritRate = stat.baseCritRate;
      stat.finalCritDamage = stat.baseCritDamage;

      combat.attack = stat.finalAttack;
      combat.defense = stat.finalDefense;
      move.speed = stat.speed;
    }
  }
}
