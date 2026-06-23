import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { LegalBlock, LegalDocumentData } from "@/types/legal";
import type { Locale } from "@/types";

interface LegalDocumentProps {
  doc: LegalDocumentData;
  locale: Locale;
}

const linkClass =
  "text-primary hover:text-accent underline underline-offset-2 transition-colors duration-200";

/*
 * Parses the lightweight inline markup used in the legal JSON into React nodes:
 *   [label](/route)  -> locale-aware internal Link (stays inside the Legal Center)
 *   **bold**         -> <strong>
 *   bare email       -> mailto: link
 * Everything else is rendered verbatim, including [BRACKET] placeholders.
 */
const renderInline = (text: string): React.ReactNode[] => {
  const re = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|([\w.+-]+@[\w-]+\.[\w.-]+)/g;
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;
  let match: RegExpExecArray | null;

  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));

    if (match[1] !== undefined) {
      nodes.push(
        <Link key={key++} href={match[2]} className={linkClass}>
          {match[1]}
        </Link>
      );
    } else if (match[3] !== undefined) {
      nodes.push(
        <strong key={key++} className="text-text font-semibold">
          {match[3]}
        </strong>
      );
    } else if (match[4] !== undefined) {
      nodes.push(
        <a key={key++} href={`mailto:${match[4]}`} className={linkClass}>
          {match[4]}
        </a>
      );
    }

    lastIndex = re.lastIndex;
  }

  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
};

const renderBlock = (block: LegalBlock, index: number) => {
  if (block.type === "list") {
    return (
      <ul key={index} className="my-4 flex flex-col gap-3">
        {block.items.map((item, i) => (
          <li
            key={i}
            className="text-text-muted relative pl-5 text-[0.95rem] leading-relaxed"
          >
            <span
              aria-hidden="true"
              className="bg-primary/70 absolute top-[0.6em] left-0 h-1.5 w-1.5 rounded-full"
            />
            {renderInline(item)}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <p key={index} className="text-text-muted my-4 text-[0.95rem] leading-relaxed">
      {renderInline(block.text)}
    </p>
  );
};

export const LegalDocument = async ({ doc, locale }: LegalDocumentProps) => {
  const t = await getTranslations({ locale, namespace: "legal" });

  return (
    <article className="max-w-[720px]">
      <h1 className="text-text text-3xl font-bold tracking-tight sm:text-4xl">{doc.title}</h1>

      {doc.intro && (
        <p className="border-primary/20 bg-primary/[0.06] text-text mt-6 rounded-xl border p-4 text-[0.95rem] font-medium leading-relaxed">
          {renderInline(doc.intro)}
        </p>
      )}

      <div className="mt-8">
        {doc.sections.map((section, i) => (
          <section key={i} className="mb-9 scroll-mt-28">
            <h2 className="text-text text-lg font-semibold sm:text-xl">{section.heading}</h2>
            {section.blocks.map(renderBlock)}
          </section>
        ))}
      </div>

      <p className="border-border text-text-muted/70 mt-12 border-t pt-6 font-mono text-xs uppercase tracking-wider">
        {t("lastUpdated")}: [DATE]
      </p>
    </article>
  );
};
