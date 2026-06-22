import { cn } from "@/lib/utils";

interface LessonCardsProps {
  cards: string[];
  more: string;
}

interface RoadmapItem {
  label: string;
  number: string;
  isMore: boolean;
}

/* Numbered vertical roadmap (syllabus / timeline) for the lessons sequence.
   Presentational: the parent section owns the GSAP scroll reveal (targets
   `.lc-card` / `.lc-more`). One continuous track on mobile; two side-by-side
   tracks from lg up. A connecting line runs between consecutive steps to convey
   sequential progression — never a grid of independent boxes. The open-ended
   "more" node always closes the sequence. */
export const LessonCards = ({ cards, more }: LessonCardsProps) => {
  const items: RoadmapItem[] = [
    ...cards.map((label, i) => ({
      label,
      number: String(i + 1).padStart(2, "0"),
      isMore: false,
    })),
    { label: more, number: "+", isMore: true },
  ];

  // Split into two near-even tracks so the lg layout reads top-to-bottom per
  // column (a guided path), not left-to-right across a grid.
  const mid = Math.ceil(items.length / 2);
  const columns = [items.slice(0, mid), items.slice(mid)];

  return (
    <div className="lc-grid mx-auto mt-14 grid max-w-4xl gap-x-12 lg:grid-cols-2">
      {columns.map((column, colIndex) => {
        const isLeftColumn = colIndex === 0;

        return (
          <ol key={colIndex} className="relative">
            {column.map((item, i) => {
              const isColumnLast = i === column.length - 1;
              // The right column ends on the "more" node — the true end of the
              // sequence. The left column's foot only breaks at lg (where the
              // right track sits beside it); on mobile the tracks stack, so the
              // line continues straight into the next step.
              const isSequenceEnd = !isLeftColumn && isColumnLast;
              const isColumnBreak = isLeftColumn && isColumnLast;

              return (
                <li
                  key={item.label}
                  className={cn(item.isMore ? "lc-more" : "lc-card", "flex gap-5")}
                >
                  <div className="flex flex-col items-center">
                    <span
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-semibold ring-1",
                        item.isMore
                          ? "text-accent bg-accent/10 ring-accent/30 text-lg leading-none"
                          : "text-primary bg-primary/10 ring-primary/20"
                      )}
                    >
                      {item.number}
                    </span>
                    {!isSequenceEnd && (
                      <span
                        aria-hidden
                        className={cn(
                          "from-primary/40 to-border my-1 w-px flex-1 bg-gradient-to-b",
                          isColumnBreak && "lg:hidden"
                        )}
                      />
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-sm leading-snug font-medium",
                      item.isMore ? "text-accent" : "text-text",
                      isSequenceEnd ? "pb-0" : "pb-8",
                      isColumnBreak && "lg:pb-0"
                    )}
                  >
                    {item.label}
                  </span>
                </li>
              );
            })}
          </ol>
        );
      })}
    </div>
  );
};
