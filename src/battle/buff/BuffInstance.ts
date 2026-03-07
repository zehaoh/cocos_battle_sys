import { BuffType } from './BuffType';

export class BuffInstance {
  public elapsed = 0;
  public tickElapsed = 0;
  constructor(
    public readonly type: BuffType,
    public readonly sourceId: number,
    public duration: number,
    public magnitude: number,
    public tick = 1,
  ) {}
}
