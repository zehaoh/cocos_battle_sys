# cocos_battle_sys

Industrial-style ARPG battle framework core written in TypeScript.

## Core 10-system battle architecture

```text
Client Input
  -> InputSystem
  -> SkillSystem
  -> SkillGraphRuntime
  -> BattleEventBus
     -> ProjectileSystem
     -> CollisionSystem
     -> CombatSystem
     -> BuffSystem
     -> SummonSystem
     -> StatSystem
     -> UnitSystem
     -> DeathSystem
     -> DropSystem
```

## Included modules

- Core runtime
  - `World` + `EntityManager` + `SystemScheduler`
  - frame-queued `EventBus` with `flush` dispatch
- Input and command pipeline
  - `InputSystem` + `InputCommand` (`CastSkill` / `Move` / `Target`)
- Skill runtime
  - `SkillSystem` checks cooldown and emits cast requests
  - `SkillGraphRuntime` executes graph via `SkillExecutor`
- Projectile runtime
  - `ProjectileFactory` + `ProjectileConfig`
  - `ProjectileSystem` owns movement/lifetime
  - `CollisionSystem` emits projectile hit events
- Industrial combat pipeline
  - `DamageRequest`, `DamageResult`, `DamageType`
  - `DamagePipeline` stages: Buff -> Defense -> Resistance -> Crit
  - modifiers: `BuffModifier`, `DefenseModifier`, `ResistanceModifier`, `CritModifier`
- Buff/stat/unit lifecycle
  - `BuffSystem`, `StatSystem`, `UnitSystem`, `DeathSystem`, `DropSystem`, `SummonSystem`
- Utility/runtime services
  - `BattleWorld`, `BattleRuntime`, `BattleConfigService`, `TimerService`
  - `BattleRecorder`, `BattleReplay`, `ServerSync`, `ClientPrediction`, `RollbackBuffer`
  - `MathUtil`, `SpatialHash`, `ObjectPool`

## Notes

Architecture follows Hybrid ECS + event-driven decoupling:
- SkillGraph only emits events, no direct system invocation
- Projectile does not calculate final HP changes
- CombatSystem is the damage pipeline entry for HP application
