import type { ActiveBuff } from '../components/BuffComponent';
import type { Buff } from './Buff';

export type BuffStackPolicy = 'refresh' | 'extend' | 'replace' | 'ignore' | 'independent';

export class BuffStackRule {
  constructor(private readonly defaultPolicy: BuffStackPolicy = 'refresh') {}

  public apply(existing: ActiveBuff | undefined, meta: Buff, policyOverride?: BuffStackPolicy): ActiveBuff {
    const policy = policyOverride ?? meta.stackPolicy ?? this.defaultPolicy;

    if (!existing) {
      return {
        id: meta.id,
        stacks: 1,
        durationLeft: meta.duration,
        periodLeft: meta.tickPeriod,
        elapsed: 0,
        stackPolicy: policy,
      };
    }

    if (policy === 'ignore') {
      return existing;
    }

    if (policy === 'independent') {
      return {
        id: meta.id,
        stacks: Math.min(meta.maxStacks, existing.stacks + 1),
        durationLeft: Math.max(existing.durationLeft, meta.duration),
        periodLeft: Math.min(existing.periodLeft, meta.tickPeriod),
        elapsed: existing.elapsed,
        stackPolicy: policy,
      };
    }

    const nextStacks = Math.min(meta.maxStacks, existing.stacks + 1);

    if (policy === 'replace') {
      return {
        id: meta.id,
        stacks: nextStacks,
        durationLeft: meta.duration,
        periodLeft: meta.tickPeriod,
        elapsed: 0,
        stackPolicy: policy,
      };
    }

    if (policy === 'extend') {
      return {
        id: meta.id,
        stacks: nextStacks,
        durationLeft: existing.durationLeft + meta.duration,
        periodLeft: Math.min(existing.periodLeft, meta.tickPeriod),
        elapsed: existing.elapsed,
        stackPolicy: policy,
      };
    }

    return {
      ...existing,
      stacks: nextStacks,
      durationLeft: meta.duration,
      periodLeft: Math.min(existing.periodLeft, meta.tickPeriod),
      stackPolicy: policy,
    };
  }
}
