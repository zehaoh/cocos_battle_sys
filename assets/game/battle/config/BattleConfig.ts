export interface BattleConfig {
  aggroDecayPerSecond: number;
  splitSearchRadius: number;
  bounceSearchRadius: number;
  splitDamageScale: number;
  maxSnapshots: number;
}

const DEFAULT_CONFIG: BattleConfig = {
  aggroDecayPerSecond: 0.25,
  splitSearchRadius: 4,
  bounceSearchRadius: 5,
  splitDamageScale: 0.6,
  maxSnapshots: 120,
};

export class BattleConfigService {
  private readonly config: BattleConfig;

  constructor(override: Partial<BattleConfig> = {}) {
    this.config = {
      ...DEFAULT_CONFIG,
      ...override,
    };
  }

  public get<K extends keyof BattleConfig>(key: K): BattleConfig[K] {
    return this.config[key];
  }

  public snapshot(): BattleConfig {
    return { ...this.config };
  }
}
