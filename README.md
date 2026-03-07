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
- Skill runtime (data-driven)
  - `SkillGraphAsset`: `nodes + edges`
  - `SkillGraphRuntime` as graph interpreter entry
  - `SkillExecutor` + `SkillNodeFactory` node execution
  - node library: `Cast`, `Delay`, `Condition`, `SpawnProjectile`, `Damage`, `AddBuff`
- Projectile runtime
  - `ProjectileFactory` + `ProjectileConfig`
  - `ProjectileSystem` owns movement/lifetime
  - `CollisionSystem` emits projectile hit events
- Industrial combat pipeline
  - `DamageRequest`, `DamageResult`, `DamageType`
  - `DamagePipeline` stages: Buff -> Defense -> Resistance -> Crit
  - modifiers: `BuffModifier`, `DefenseModifier`, `ResistanceModifier`, `CritModifier`
- Buff lifecycle system (data-driven)
  - `BuffSystem`: add/tick/expire
  - stack policies: `refresh`, `extend`, `replace`, `ignore`, `independent`
  - events: `buffAdd`, `buffTick`, `buffExpire`
- Buff/stat/unit lifecycle
  - `BuffSystem`, `StatSystem`, `UnitSystem`, `DeathSystem`, `DropSystem`, `SummonSystem`
- Utility/runtime services
  - `BattleWorld`, `BattleRuntime`, `BattleConfigService`, `TimerService`
  - `BattleRecorder`, `BattleReplay`, `ServerSync`, `ClientPrediction`, `RollbackBuffer`
  - `MathUtil`, `SpatialHash`, `ObjectPool`

## Notes

Architecture follows Hybrid ECS + event-driven decoupling:
- SkillGraph only emits events / execution signals, no direct system coupling
- Projectile does not calculate final HP changes
- Combat pipeline is the HP change authority
