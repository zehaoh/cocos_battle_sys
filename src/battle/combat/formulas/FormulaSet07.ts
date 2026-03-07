export interface FormulaInput {
  attack: number;
  defense: number;
  crit: number;
  power: number;
  resistance: number;
}

export class FormulaSet07 {
  public static base(input: FormulaInput): number {
    return Math.max(1, input.attack * (1 + input.power * 0.1));
  }

  public static reduced(input: FormulaInput): number {
    const base = this.base(input);
    return Math.max(1, base * (100 / (100 + input.defense)));
  }

  public static critical(input: FormulaInput): number {
    const reduced = this.reduced(input);
    return Math.random() < input.crit ? reduced * (1.2 + 7 * 0.01) : reduced;
  }

  public static elemental(input: FormulaInput): number {
    const c = this.critical(input);
    return Math.max(0, c * (1 - input.resistance));
  }

  public static burst(input: FormulaInput): number {
    return this.elemental(input) + (7 % 4) * 2;
  }

  public static sustained(input: FormulaInput, ticks = 3): number {
    let total = 0;
    for (let t = 0; t < ticks; t++) total += this.elemental(input) * (0.7 + t * 0.1);
    return total;
  }

  public static summary(input: FormulaInput): { burst: number; sustain: number } {
    return {
      burst: Math.floor(this.burst(input)),
      sustain: Math.floor(this.sustained(input, 4)),
    };
  }
}
