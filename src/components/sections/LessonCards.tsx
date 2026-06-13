import { cn } from "@/lib/utils";

interface LessonCardsProps {
  cards: string[];
  more: string;
}

/* Competence-framed lesson cards + a qualitative "much more" tile. Presentational:
   the parent section owns the GSAP scroll reveal (targets `.lc-card` / `.lc-more`).
   The grid is always laid out at full size — the reveal only animates transform +
   opacity, so surrounding content never shifts (no CLS). */
export const LessonCards = ({ cards, more }: LessonCardsProps) => {
  return (
    <div className="lc-grid mx-auto mt-14 grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
      {cards.map((label, i) => (
        <div
          key={label}
          className="lc-card border-border bg-surface/50 hover:border-primary/50 hover:shadow-glow flex items-start gap-3 rounded-2xl border p-4 transition-all duration-300 hover:-translate-y-1"
        >
          <span className="text-primary bg-primary/10 ring-primary/20 mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-semibold ring-1">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="text-text text-sm leading-snug font-medium">{label}</span>
        </div>
      ))}

      <div
        className={cn(
          "lc-more border-primary/40 text-accent flex items-center justify-center gap-2 rounded-2xl",
          "border border-dashed bg-[linear-gradient(135deg,rgba(148,30,254,0.12),transparent)]",
          "p-4 text-center text-sm font-semibold"
        )}
      >
        <span aria-hidden className="text-lg leading-none">
          +
        </span>
        {more}
      </div>
    </div>
  );
};
