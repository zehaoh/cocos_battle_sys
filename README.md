# cocos_battle_sys

Functional ARPG combat engine scaffold (TypeScript) with integrated ECS, Combat, SkillGraph runtime, Buffs, AI behavior trees, navigation, animation state machine, event bus, config loading, and battle simulation.

## Implemented engine modules

- ECS core
  - `Entity`, `Component`, `EntityManager`, `World`, `SystemPriority`, query/update loop.
- Combat
  - `CombatSystem`, `DamageCalculator`, `HitSystem`, `DamageContext`, `DamageResult`.
- Skill
  - Data-driven `SkillGraph`, `SkillRuntime`, `SkillSystem`, skill node library and runtime step executors.
- Buff
  - `BuffSystem`, `BuffInstance`, `BuffType`, per-type handlers (`Poison`, `Stun`, `Slow`, `Shield`, etc.).
- AI
  - BehaviorTree nodes (`BTSelector`, `BTSequence`, `BTCondition`, `BTAction`, `BTDecorator`, `BTParallel`) and `AISystem`.
- Aggro
  - `ThreatTable`, `AggroSystem` with damage/heal/taunt sources and decay.
- Navigation
  - `GridNav`, `AStar`, `NavigationSystem`, heuristics modules.
- Animation
  - `AnimationStateMachine` (`Idle`, `Move`, `Attack`, `Hit`, `Death`) and `AnimationSystem`.
- EventBus
  - Prioritized listeners with `on`, `once`, `off`, `emit`; engine events (`ATTACK`, `DAMAGE`, `SKILL_CAST`, `DEATH`, etc.).
- Data-driven configs
  - `configs/skills.json`, `configs/monsters.json`, `configs/buffs.json` and `ConfigService`.
- Demo simulation
  - `src/demo/DemoSimulation.ts` demonstrates:
    - Player attacks monster via SkillSystem
    - Combat damage application
    - AI monster chase/attack loop

## System dependency diagram

```text
InputSystem -> SkillSystem -> CombatSystem -> BuffSystem
AISystem -> AggroSystem -> NavigationSystem -> CombatSystem
SkillRuntime -> EventBus(ATTACK/SKILL_CAST/BUFF_ADD)
ProjectileSystem -> EventBus(PROJECTILE_HIT/ATTACK)
CombatSystem -> EventBus(DAMAGE/DEATH)
AnimationSystem <- EventBus(ANIM_PLAY)
```

## Battle execution flow

```text
Player Command
 -> SKILL_CAST
 -> SkillRuntime (PlayAnimation -> SpawnHitbox -> ApplyDamage -> ApplyBuff)
 -> ATTACK
 -> CombatSystem.attack/applyDamage
 -> DAMAGE / DEATH events
 -> Aggro + AI + Buff + Animation reactions
```

## File structure (top-level)

```text
src/
  core/
  battle/
  ai/
  navigation/
  animation/
  simulation/
  data/
  demo/
  debug/
  tools/
configs/
```
