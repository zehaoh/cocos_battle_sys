export interface EditorSkillEdge {
  from: string;
  to: string;
}

export class EdgeView {
  constructor(public readonly edge: EditorSkillEdge) {}

  public draw(
    ctx: { drawBezier: (x1: number, y1: number, cx1: number, cy1: number, cx2: number, cy2: number, x2: number, y2: number) => void },
    from: { x: number; y: number },
    to: { x: number; y: number },
  ): void {
    const c1x = from.x + 60;
    const c2x = to.x - 60;
    ctx.drawBezier(from.x, from.y, c1x, from.y, c2x, to.y, to.x, to.y);
  }
}
