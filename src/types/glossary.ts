export type GlossaryCategory =
  | "forex-basics"
  | "technical-analysis"
  | "fundamental-analysis"
  | "risk-management"
  | "trading-psychology"
  | "order-types"
  | "market-structure"
  | "indicators"
  | "crypto"
  | "stocks";

export interface GlossaryTerm {
  slug: string;
  term: string;
  category: GlossaryCategory;
  definition: string;
  extended: string;
  related: string[];
}

export interface GlossaryData {
  terms: GlossaryTerm[];
}
