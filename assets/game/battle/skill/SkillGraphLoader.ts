import type { SkillGraphAsset } from './SkillGraph';
import { SkillGraphUtil } from './SkillGraph';

export class SkillGraphLoader {
  public loadFromJSON(json: string): SkillGraphAsset {
    return SkillGraphUtil.fromJSON(json);
  }
}
