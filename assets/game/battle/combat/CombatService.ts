import { DamageCalculator } from './DamageCalculator';

export class CombatService {
  private readonly calculator = new DamageCalculator();

  public computeDamage(rawDamage: number, defense: number): number {
    return this.calculator.calc({
      rawDamage,
      defense,
    });
  }
}
