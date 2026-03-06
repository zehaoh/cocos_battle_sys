import type { ActiveBuff } from '../components/BuffComponent';
import type { Buff } from './Buff';

export type BuffStackPolicy = 'refresh' | 'extend' | 'replace';

export class BuffStackRule {
  constructor(private readonly policy: BuffStackPolicy = 'refresh') {}

  public apply(existing: ActiveBuff | undefined, meta: Buff): ActiveBuff {
    if (!existing) {
      return {
        id: meta.id,
        stacks: 1,
        durationLeft: meta.duration,
        periodLeft: meta.tickPeriod,
      };
    }

    const nextStacks = Math.min(meta.maxStacks, existing.stacks + 1);

    if (this.policy === 'replace') {
      return {
        id: meta.id,
        stacks: nextStacks,
        durationLeft: meta.duration,
        periodLeft: meta.tickPeriod,
      };
    }

    if (this.policy === 'extend') {
      return {
        id: meta.id,
        stacks: nextStacks,
        durationLeft: existing.durationLeft + meta.duration,
        periodLeft: Math.min(existing.periodLeft, meta.tickPeriod),
      };
    }

    return {
      ...existing,
      stacks: nextStacks,
      durationLeft: meta.duration,
      periodLeft: Math.min(existing.periodLeft, meta.tickPeriod),
    };
  }
}
