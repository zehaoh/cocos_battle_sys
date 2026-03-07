# cocos_battle_sys

Industrial-style ARPG battle framework core written in TypeScript.

## Included modules

- Core runtime
  - `World` + `EntityManager` + `SystemScheduler`
  - frame-queued `EventBus` with `flush` dispatch
- Math/runtime utilities (`MathUtil`, `SpatialHash`, `ObjectPool`, `TimerService`)
- Battle components and runtime systems (movement/combat/skill/projectile/buff/aggro/ai/sync)
- `BattleWorld` orchestration + `BattleRuntime` pipeline installer
- Service layer
  - `BattleConfigService`
  - `CombatService` + `DamagePipeline`
- Industrial combat pipeline
  - `DamageRequest`, `DamageResult`, `DamageType`
  - modifiers: `BuffModifier`, `DefenseModifier`, `ResistanceModifier`, `CritModifier`
  - flow: Projectile/Skill -> `damageRequest` -> combat pipeline -> HP/event
- Data-driven SkillGraph runtime
  - graph schema: `SkillGraph` / `SkillNodeData`
  - executor + node factory: `SkillExecutor`, `SkillNodeFactory`
  - node library: `Cast`, `Delay`, `Condition`, `SpawnProjectile`, `Damage`, `AddBuff`
- Data-driven Projectile runtime
  - `ProjectileFactory` + `ProjectileConfig`
  - `ProjectileSystem` handles move/collision/life-cycle only
  - emits `projectileHit`; damage is handled by combat flow
  - behaviors: `Linear`, `Homing`, `Bounce`, `Split`
- Buff stack policy (`refresh` / `extend` / `replace`)
- Aggro subsystem with threat table + taunt + decay
- AI behavior tree primitives (`Selector` / `Sequence` / `Condition`)
- NavMesh A* pathfinding
- Replay + networking skeleton (`BattleRecorder`, `BattleReplay`, `ServerSync`, `ClientPrediction`, `RollbackBuffer`)

## Notes

Architecture follows a Hybrid ECS blueprint for Cocos-style ARPG battle runtimes:
- Systems communicate via `World.eventBus` (instead of direct system-to-system calls)
- Components store data only
- Skill/Buff/AI/Projectile/Combat logic is organized toward data-driven extension
