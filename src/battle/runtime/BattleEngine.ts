import { AggroSystem } from '../../ai/aggro/AggroSystem';
import { AISystem } from '../../ai/AISystem';
import { AnimationSystem } from '../../animation/AnimationSystem';
import { System } from '../../core/ecs/System';
import { SystemPriority } from '../../core/ecs/SystemPriority';
import { World } from '../../core/ecs/World';
import { NavigationSystem } from '../../navigation/NavigationSystem';
import { BuffSystem } from '../buff/BuffSystem';
import { CombatSystem } from '../combat/CombatSystem';
import { ProjectileSystem } from '../projectile/ProjectileSystem';
import { SkillSystem } from '../skill/SkillSystem';
import { DebugCombatLogSystem } from '../systems/DebugCombatLogSystem';
import { DeathSystem } from '../systems/DeathSystem';
import { InputSystem } from '../systems/InputSystem';
import { MovementSystem } from '../systems/MovementSystem';
import { RenderSystem } from '../systems/RenderSystem';
import { StatSystem } from '../systems/StatSystem';
import { UnitSystem } from '../systems/UnitSystem';

class HeartbeatSystem extends System {
  constructor() { super(SystemPriority.RENDER - 2); }
  public update(): void { this.world.eventBus.emit('HEARTBEAT', Date.now()); }
}

export class BattleEngine {
  public readonly world = new World();
  public readonly skillSystem = new SkillSystem();

  public installDefaultSystems(): void {
    this.world.addSystem(new InputSystem());
    this.world.addSystem(new AISystem());
    this.world.addSystem(new AggroSystem());
    this.world.addSystem(this.skillSystem);
    this.world.addSystem(new ProjectileSystem());
    this.world.addSystem(new CombatSystem());
    this.world.addSystem(new BuffSystem());
    this.world.addSystem(new AnimationSystem());
    this.world.addSystem(new NavigationSystem());
    this.world.addSystem(new MovementSystem());
    this.world.addSystem(new StatSystem());
    this.world.addSystem(new UnitSystem());
    this.world.addSystem(new DeathSystem());
    this.world.addSystem(new HeartbeatSystem());
    this.world.addSystem(new DebugCombatLogSystem());
    this.world.addSystem(new RenderSystem());
  }
}
