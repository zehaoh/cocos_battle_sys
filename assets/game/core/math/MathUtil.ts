export interface Vec2 {
  x: number;
  y: number;
}

export const MathUtil = {
  clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
  },

  lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
  },

  distanceSq(a: Vec2, b: Vec2): number {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return dx * dx + dy * dy;
  },

  distance(a: Vec2, b: Vec2): number {
    return Math.sqrt(MathUtil.distanceSq(a, b));
  },

  normalize(v: Vec2): Vec2 {
    const len = Math.sqrt(v.x * v.x + v.y * v.y);
    if (len <= Number.EPSILON) return { x: 0, y: 0 };
    return { x: v.x / len, y: v.y / len };
  },
};
