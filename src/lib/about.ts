import aboutJson from "@/data/about.json";
import type { LocalizedField } from "@/types/glossary";
import type { Locale } from "@/types";

/*
 * Server-only helpers over src/data/about.json. Localizes the tagline, ordered
 * sections, and closing quote for a given locale.
 */

interface RawAboutSection {
  id: string;
  title: LocalizedField;
  paragraphs: Record<Locale, string[]>;
}

interface RawAboutData {
  tagline: LocalizedField;
  closing: LocalizedField;
  sections: RawAboutSection[];
}

export interface AboutSection {
  id: string;
  title: string;
  paragraphs: string[];
}

export interface AboutContentData {
  tagline: string;
  closing: string;
  sections: AboutSection[];
}

const data = aboutJson as RawAboutData;

export const getAboutData = (locale: Locale): AboutContentData => ({
  tagline: data.tagline[locale],
  closing: data.closing[locale],
  sections: data.sections.map((s) => ({
    id: s.id,
    title: s.title[locale],
    paragraphs: s.paragraphs[locale],
  })),
});
