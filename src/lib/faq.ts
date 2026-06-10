import faqJson from "@/data/faq.json";
import type { LocalizedField } from "@/types/glossary";
import type { Locale } from "@/types";

/*
 * Server-only helpers over src/data/faq.json. Localizes categories + questions
 * for a given locale and exposes the "featured" subset used on the homepage.
 */

interface RawFaqCategory {
  id: string;
  label: LocalizedField;
}

interface RawFaqQuestion {
  id: string;
  category: string;
  featured: boolean;
  question: LocalizedField;
  answer: LocalizedField;
}

interface RawFaqData {
  categories: RawFaqCategory[];
  questions: RawFaqQuestion[];
}

export interface FaqCategory {
  id: string;
  label: string;
}

export interface FaqQuestion {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const data = faqJson as RawFaqData;

export const getFaqCategories = (locale: Locale): FaqCategory[] =>
  data.categories.map((c) => ({ id: c.id, label: c.label[locale] }));

export const getFaqQuestions = (locale: Locale): FaqQuestion[] =>
  data.questions.map((q) => ({
    id: q.id,
    category: q.category,
    question: q.question[locale],
    answer: q.answer[locale],
  }));

/** Only questions flagged `"featured": true` — drives the homepage FAQ section. */
export const getFeaturedFaqQuestions = (locale: Locale): FaqQuestion[] =>
  data.questions
    .filter((q) => q.featured)
    .map((q) => ({
      id: q.id,
      category: q.category,
      question: q.question[locale],
      answer: q.answer[locale],
    }));
