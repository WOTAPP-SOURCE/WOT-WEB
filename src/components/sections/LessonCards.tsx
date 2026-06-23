import type { ComponentType } from "react";
import {
  CandlestickChartIcon,
  BrainIcon,
  ShieldCheckIcon,
  CrosshairIcon,
  WavesIcon,
  ClipboardListIcon,
  CalculatorIcon,
  TrendingUpIcon,
  BookOpenIcon,
  BotIcon,
  TargetIcon,
  PlusIcon,
  SparklesIcon,
} from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

interface LessonCardsProps {
  cards: string[];
  more: string;
}

type IconComponent = ComponentType<{ className?: string }>;

interface RoadmapItem {
  label: string;
  Icon: IconComponent;
  isMore: boolean;
}

// Thematic icons mapped BY INDEX. The localized `cards` arrays are parallel
// across FR/EN/ES, so the position is stable even though the strings differ.
// These icons convey each lesson's THEME, not a sequence — there is no fixed
// in-app order, which is why the old 01/02/03 number badges were dropped.
const LESSON_ICONS: IconComponent[] = [
  CandlestickChartIcon, // 0 — market structure
  BrainIcon, // 1 — trader psychology / tilt
  ShieldCheckIcon, // 2 — risk management
  CrosshairIcon, // 3 — anatomy of a setup
  WavesIcon, // 4 — support, resistance & liquidity zones
  ClipboardListIcon, // 5 — trading plan
  CalculatorIcon, // 6 — position sizing & money management
  TrendingUpIcon, // 7 — trends, ranges & breakouts
  BookOpenIcon, // 8 — trading journal
  BotIcon, // 9 — integrating AI into your trading
  TargetIcon, // 10 — mastering SMC / ICT
];

/* Lessons roadmap (LEÇONS). Each lesson sits in a rounded purple badge with a
   thematic icon — the icons describe the topic, NOT an order, so there are no
   numbers and no connecting line implying a sequence. Presentational only: the
   parent section owns the GSAP reveal (targets `.lc-card` / `.lc-more`). One
   column on mobile, two balanced columns from lg up. The open-ended "more" node
   always closes the set. */
export const LessonCards = ({ cards, more }: LessonCardsProps) => {
  const items: RoadmapItem[] = [
    ...cards.map((label, i) => ({
      label,
      // Fallback keeps the UI safe if the card list ever outgrows the icon map.
      Icon: LESSON_ICONS[i] ?? SparklesIcon,
      isMore: false,
    })),
    { label: more, Icon: PlusIcon, isMore: true },
  ];

  // Split into two near-even tracks so the lg layout balances left/right.
  const mid = Math.ceil(items.length / 2);
  const columns = [items.slice(0, mid), items.slice(mid)];

  return (
    <div className="lc-grid mx-auto mt-14 grid max-w-4xl gap-x-12 gap-y-4 lg:grid-cols-2">
      {columns.map((column, colIndex) => (
        <ul key={colIndex} className="flex flex-col gap-4">
          {column.map((item) => {
            const Icon = item.Icon;

            return (
              <li
                key={item.label}
                className={cn(
                  item.isMore ? "lc-more" : "lc-card",
                  "flex items-center gap-4"
                )}
              >
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ring-1",
                    item.isMore
                      ? "text-accent bg-accent/10 ring-accent/30"
                      : "text-primary bg-primary/10 ring-primary/20"
                  )}
                >
                  <Icon className="h-[18px] w-[18px]" />
                </span>
                <span
                  className={cn(
                    "text-sm leading-snug font-medium",
                    item.isMore ? "text-accent" : "text-text"
                  )}
                >
                  {item.label}
                </span>
              </li>
            );
          })}
        </ul>
      ))}
    </div>
  );
};
