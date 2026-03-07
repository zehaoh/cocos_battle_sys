export enum AnimationState {
  Idle = 'Idle',
  Move = 'Move',
  Attack = 'Attack',
  Hit = 'Hit',
  Death = 'Death',
}

export class AnimationStateMachine {
  public current: AnimationState = AnimationState.Idle;
  public time = 0;

  public update(dt: number): void {
    this.time += dt;
    if (this.current === AnimationState.Attack && this.time > 0.4) this.change(AnimationState.Idle);
    if (this.current === AnimationState.Hit && this.time > 0.2) this.change(AnimationState.Idle);
  }

  public change(next: AnimationState): void {
    this.current = next;
    this.time = 0;
  }
}
