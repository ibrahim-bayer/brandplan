export interface BrandPlanTokens {
  space: Record<string, string>;
  radius: Record<string, string>;
  color: Record<string, Record<string, { dark: string; light: string }>>;
}

export interface BrandPlan {
  space: Record<string, string>;
  radius: Record<string, string>;
  color: Record<string, Record<string, { dark: string; light: string }>>;
}
