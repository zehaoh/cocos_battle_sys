export const SYSTEM_DEPENDENCY_DIAGRAM = `
Input -> SkillSystem -> CombatSystem -> BuffSystem
AI -> AggroSystem -> NavigationSystem -> CombatSystem
SkillSystem -> ProjectileSystem -> CombatSystem
CombatSystem -> EventBus(DAMAGE/DEATH)
AnimationSystem listens ANIM_PLAY
`;
