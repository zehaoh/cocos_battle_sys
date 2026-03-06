# cocos_battle_sys

Industrial-style ARPG battle framework skeleton written in TypeScript.

## Included modules

- ECS core (`Entity`, `Component`, `System`, `World`, managers)
- Math and utilities (`MathUtil`, `SpatialHash`, `ObjectPool`)
- Battle components and systems
- `BattleWorld` orchestration and `UnitFactory`
- Skill graph + executor + nodes
- Projectile behavior pipeline
- Buff model + stack policies
- Aggro and AI systems
- NavMesh A* pathfinding
- Battle recorder + replay reader
- Server sync + client prediction skeleton

## Directory

```text
assets/game/
  core/
  battle/
```

## Notes

This is a runnable architecture skeleton intended for iterative expansion into a full project-scale ARPG combat stack.
