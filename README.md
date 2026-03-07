# cocos_battle_sys

Industrial-style ARPG battle framework core written in TypeScript.

## Included modules

- ECS core (`Entity`, `Component`, `System`, `World`, managers)
  - Query execution uses component-index intersection instead of brute-force scanning
- Math and runtime utilities (`MathUtil`, `SpatialHash`, `ObjectPool`)
- Battle components and runtime systems
- `BattleWorld` orchestration and `UnitFactory`
- Service layer for runtime composition:
  - `BattleRuntime` default system pipeline installer
  - `BattleConfigService` for tunables
  - `EventBus` for decoupled gameplay events
- Skill graph + executor + sample nodes
- Projectile behavior pipeline with multi-mode projectiles:
  - `homing`, `linear`, `pierce`, `split`, `bounce`
- Buff model + stack policy (`refresh` / `extend` / `replace`)
- Aggro subsystem with threat table + taunt support + decay
- AI behavior tree primitives (`Selector` / `Sequence` / `Condition`) + AI system integration
- NavMesh A* pathfinding
- Battle recorder + replay reader
- Network sync framework with snapshot sync + client prediction + rollback buffer

## Directory

```text
assets/game/
  core/
  battle/
```

## Notes

This repository is a battle-engine foundation intended to scale from framework skeleton toward full ARPG production runtime.
