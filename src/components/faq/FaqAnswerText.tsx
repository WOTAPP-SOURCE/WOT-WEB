"use client";

import { ScrollNavLink } from "@/components/layout/ScrollNavLink";

interface FaqAnswerTextProps {
  answer: string;
}

/*
 * Renders a FAQ answer string. A single `**...**` span is turned into a bold,
 * brand-purple link that scrolls to the homepage pricing section (same behavior as
 * the header "Tarifs" link: in-page scroll on home, navigate + HashScroll from /faq).
 * Answers without the marker render as plain text, unchanged.
 */
export const FaqAnswerText = ({ answer }: FaqAnswerTextProps) => {
  const match = answer.match(/^([\s\S]*?)\*\*(.+?)\*\*([\s\S]*)$/);

  if (!match) return <>{answer}</>;

  const [, before, linkText, after] = match;

  return (
    <>
      {before}
      <ScrollNavLink
        hash="pricing"
        className="text-primary font-semibold underline-offset-2 transition-colors duration-200 hover:text-accent hover:underline"
      >
        {linkText}
      </ScrollNavLink>
      {after}
    </>
  );
};
