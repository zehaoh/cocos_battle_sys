import { System } from '../../core/ecs/System';
import type { World } from '../../core/ecs/World';
import { CombatComponent } from '../components/CombatComponent';
import { TargetComponent } from '../components/TargetComponent';
import { ThreatComponent } from '../components/ThreatComponent';
import { ThreatRule } from '../aggro/ThreatRule';
import { TargetSelector } from '../aggro/TargetSelector';

interface DamageEvent {
  attackerId: number;
  defenderId: number;
  damage: number;
}

interface HealEvent {
  sourceId: number;
  targetId: number;
  heal: number;
}

interface TauntEvent {
  sourceId: number;
  targetId: number;
  value?: number;
}

interface BuffEvent {
  sourceId?: number;
  entityId: number;
  stacks: number;
}

export class AggroSystem extends System {
  private readonly selector = new TargetSelector();
  private readonly threatRule = new ThreatRule();
  private readonly unsubscribers: Array<() => void> = [];

  constructor(private readonly decayPerTick = 0.99) {
    super(15);
  }

  public override onAttach(world: World): void {
    this.unsubscribers.push(
      world.eventBus.on('damage', (payload) => this.onDamage(world, payload as DamageEvent)),
      world.eventBus.on('heal', (payload) => this.onHeal(world, payload as HealEvent)),
      world.eventBus.on('taunt', (payload) => this.onTaunt(world, payload as TauntEvent)),
      world.eventBus.on('buffApply', (payload) => this.onBuff(world, payload as BuffEvent)),
    );
  }

  public override onDetach(): void {
    while (this.unsubscribers.length > 0) {
      const off = this.unsubscribers.pop() as () => void;
      off();
    }
  }

  public update(world: World, _dt: number): void {
    for (const entity of world.query(['Combat', 'Threat', 'Target'])) {
      const combat = entity.get<CombatComponent>('Combat') as CombatComponent;
      const threat = entity.get<ThreatComponent>('Threat') as ThreatComponent;
      const target = entity.get<TargetComponent>('Target') as TargetComponent;

      if (!combat.alive) {
        threat.currentTarget = null;
        target.targetId = null;
        continue;
      }

      threat.table.decay(this.decayPerTick);
      const nextTarget = this.selector.selectTarget(world, entity.id, threat);
      threat.currentTarget = nextTarget;
      target.targetId = nextTarget;
    }
  }

  private onDamage(world: World, event: DamageEvent): void {
    const threatOwner = world.getEntity(event.defenderId);
    const comp = threatOwner?.get<ThreatComponent>('Threat');
    if (!comp) return;
    comp.table.add(event.attackerId, this.threatRule.fromDamage(event.damage));
  }

  private onHeal(world: World, event: HealEvent): void {
    const healed = world.getEntity(event.targetId);
    const healedCombat = healed?.get<CombatComponent>('Combat');
    if (!healedCombat) return;

    for (const entity of world.query(['Combat', 'Threat'])) {
      const combat = entity.get<CombatComponent>('Combat') as CombatComponent;
      if (combat.team === healedCombat.team || !combat.alive) continue;
      const threat = entity.get<ThreatComponent>('Threat') as ThreatComponent;
      threat.table.add(event.sourceId, this.threatRule.fromHeal(event.heal));
    }
  }

  private onTaunt(world: World, event: TauntEvent): void {
    const taunted = world.getEntity(event.targetId);
    const threat = taunted?.get<ThreatComponent>('Threat');
    if (!threat) return;
    threat.table.add(event.sourceId, this.threatRule.fromTaunt(event.value));
  }

  private onBuff(world: World, event: BuffEvent): void {
    if (event.sourceId === undefined) return;

    const buffed = world.getEntity(event.entityId);
    const buffedCombat = buffed?.get<CombatComponent>('Combat');
    if (!buffedCombat) return;

    for (const entity of world.query(['Combat', 'Threat'])) {
      const combat = entity.get<CombatComponent>('Combat') as CombatComponent;
      if (combat.team === buffedCombat.team || !combat.alive) continue;
      const threat = entity.get<ThreatComponent>('Threat') as ThreatComponent;
      threat.table.add(event.sourceId, this.threatRule.fromBuff(event.stacks));
    }
  }
}
