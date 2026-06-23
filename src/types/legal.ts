/*
 * Types for the Legal Center documents (Disclaimer, Privacy, Cookies, Legal Notice).
 * Content lives in src/data/legal/{locale}.json and is rendered by LegalDocument.
 * Inline strings may contain lightweight markup parsed at render time:
 *   **bold**, [label](/route) internal links, and bare email addresses.
 */

export type LegalBlock =
  | { type: "p"; text: string }
  | { type: "list"; items: string[] };

export interface LegalSection {
  heading: string;
  blocks: LegalBlock[];
}

export interface LegalDocumentData {
  /** Route slug — also the key used in the locale JSON files. */
  slug: string;
  title: string;
  /** Optional lead paragraph rendered in a highlighted callout (Disclaimer only). */
  intro?: string;
  sections: LegalSection[];
}
