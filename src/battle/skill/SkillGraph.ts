export interface SkillGraph {
  id: string;
  nodes: Array<{ id: string; type: string; next?: string[]; params?: Record<string, unknown> }>;
}

export function loadSkillGraph(json: string): SkillGraph {
  const data = JSON.parse(json) as SkillGraph;
  return {
    id: data.id,
    nodes: data.nodes ?? [],
  };
}
