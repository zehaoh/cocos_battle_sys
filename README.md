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

## Blueprint upgrades in this revision

- BehaviorTree AI stack
  - `BehaviorNode`, `SelectorNode`, `SequenceNode`, `DecoratorNode`, `ConditionNode`, `ActionNode`
  - `Blackboard` + `AIContext`
  - `BehaviorTreeLoader` for JSON-defined trees
  - `AISystem` ticks per-entity tree instances
- Navigation stack
  - `AStar`, `GridNav`, runtime `NavMesh` adapter
  - `Pathfinder`, `PathComponent`, `NavSystem`
  - integrated into `BattleRuntime` navigation selection
- SkillGraph editor/plugin scaffolding
  - `SkillGraphEditor`, `NodeView`, `EdgeView`, `GraphSerializer`, `SkillGraphPreview`
  - `SkillGraphLoader` for JSON asset import
  - SkillGraph asset model now supports `nodes + edges`


- Advanced combat control additions
  - Threat/Aggro stack: `ThreatComponent`, `ThreatTable`, `ThreatRule`, `TargetSelector`, `AggroSystem`
  - Animation driven combat: `AnimationEventComponent`, `AnimationEventSystem`, `AnimationEventDispatcher`
  - Deterministic simulation: `CommandQueue`, `SimulationClock`, `BattleSimulator`, `SnapshotSystem`

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
- Projectile runtime
  - `ProjectileFactory` + `ProjectileConfig`
  - `ProjectileSystem` owns movement/lifetime
  - `CollisionSystem` emits projectile hit events
- Industrial combat pipeline
  - `DamageRequest`, `DamageResult`, `DamageType`
  - `DamagePipeline` stages: Buff -> Defense -> Resistance -> Crit
- Buff lifecycle system (data-driven)
  - `BuffSystem`: add/tick/expire
  - stack policies: `refresh`, `extend`, `replace`, `ignore`, `independent`

## Notes

Architecture follows Hybrid ECS + event-driven decoupling:
- SkillGraph runtime is an interpreter over graph assets
- Buff lifecycle is policy-driven and event-observable
- Combat pipeline is the HP change authority


## Branch visibility note

If you cannot find a referenced commit hash in this branch, verify with:

```bash
git log --oneline -5
git branch --show-current
```

This repository currently tracks ARPG battle framework code under `assets/game/**` and may include iterative refactor commits over time.
