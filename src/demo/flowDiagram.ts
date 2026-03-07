export const BATTLE_FLOW = `
Player Attack Command
 -> SKILL_CAST
 -> SkillRuntime nodes (PlayAnimation -> SpawnHitbox -> ApplyDamage -> ApplyBuff)
 -> ATTACK
 -> CombatSystem.applyDamage
 -> DAMAGE event
 -> Aggro/Buff/AI reactions
`;
