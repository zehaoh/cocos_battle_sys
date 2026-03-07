export interface Vec2 { x: number; y: number; }

export const Vec2Util = {
  add(a: Vec2, b: Vec2): Vec2 { return { x: a.x + b.x, y: a.y + b.y }; },
  sub(a: Vec2, b: Vec2): Vec2 { return { x: a.x - b.x, y: a.y - b.y }; },
  mul(a: Vec2, s: number): Vec2 { return { x: a.x * s, y: a.y * s }; },
  len(a: Vec2): number { return Math.sqrt(a.x * a.x + a.y * a.y); },
  norm(a: Vec2): Vec2 { const l = this.len(a) || 1; return { x: a.x / l, y: a.y / l }; },
  dist(a: Vec2, b: Vec2): number { return this.len(this.sub(a, b)); },
};
