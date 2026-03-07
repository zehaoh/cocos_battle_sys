import { JsonLoader } from '../core/data/JsonLoader';
import type { BuffConfig, MonsterConfig, SkillConfig } from './types';

export class ConfigService {
  public skills: SkillConfig[] = [];
  public monsters: MonsterConfig[] = [];
  public buffs: BuffConfig[] = [];

  public loadAll(base = 'configs'): void {
    this.skills = JsonLoader.load<SkillConfig[]>(`${base}/skills.json`);
    this.monsters = JsonLoader.load<MonsterConfig[]>(`${base}/monsters.json`);
    this.buffs = JsonLoader.load<BuffConfig[]>(`${base}/buffs.json`);
  }
}
