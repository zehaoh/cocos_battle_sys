export interface EditorSkillNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  params: Record<string, unknown>;
  outputs: string[];
}

export class NodeView {
  constructor(public readonly node: EditorSkillNode) {}

  public draw(ctx: { drawRect: (x: number, y: number, w: number, h: number) => void }): void {
    ctx.drawRect(this.node.position.x, this.node.position.y, 160, 50);
  }
}
