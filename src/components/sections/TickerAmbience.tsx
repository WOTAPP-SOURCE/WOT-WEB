/* ============================================================================
 * TickerAmbience — AMBIENT DECORATION LAYER (fully self-contained)
 * ----------------------------------------------------------------------------
 * Renders tiny ephemeral "ticker pills" — small rounded badges holding a short
 * market symbol (EUR/USD, BTC, AAPL, XAU/USD …) — that fade in, hold briefly,
 * then fade out at scattered positions AROUND the hero robot. Only a couple are
 * alive at any moment: a light, sparse, gently looping ambience.
 *
 * Same ephemeral lifecycle as the (removed) candlestick layer it replaced.
 *
 * ISOLATION NOTES (read before removing):
 *   • Purely decorative, additive layer. Does NOT touch the orbit rings, the
 *     mascot, or the floating info cards.
 *   • All styles (keyframes + layout + colours) live in the inline <style>
 *     block below so the whole effect can be removed in ONE step:
 *        1. delete this file
 *        2. delete the <TickerAmbience /> usage + import in HeroSection.tsx
 *     Nothing else in the codebase references it.
 *   • Positioned `absolute inset-0` with NO z-index → renders behind the mascot
 *     (z-10) and behind the info cards (z-20). `pointer-events-none` +
 *     `aria-hidden` keep it inert and invisible to assistive tech.
 *   • Slot positions avoid the robot's face (centre) and the four corner cards
 *     (COACH IA / GRAPHIQUE IA / HISTORIQUE IA / GLOSSAIRE).
 *   • TEXT-ONLY symbols by design — NO company logos / brand marks (trademark
 *     reasons). Every item is a styled text pill.
 *   • On mobile portrait a dedicated layout (see the `max-width:639px` media
 *     query) repositions a trimmed subset of pills INTO the gaps between the
 *     corner cards, anchoring right-side pills from the right edge so nothing
 *     can spill past the viewport — verified no horizontal scroll at 360/390px.
 *   • Fully disabled under prefers-reduced-motion.
 * ==========================================================================*/

interface TickerAmbienceProps {
  /** Optional extra classes for the wrapper (rarely needed). */
  className?: string;
}

// Category drives a subtle, on-brand colour hint (a coloured dot + faint border
// tint) — tasteful, not a rainbow. forex=accent purple, crypto=cyan,
// stk=pink, cmd=amber/gold.
type Category = "forex" | "crypto" | "stk" | "cmd";

// One pill per slot. `cls` = positioning/timing class (see <style> below).
// Symbols are spread across slots so a varied mix pops around the robot over a
// cycle even though only a few show at once.
const PILLS: { cls: string; sym: string; cat: Category }[] = [
  { cls: "s1", sym: "BTC", cat: "crypto" },
  { cls: "s2", sym: "EUR/USD", cat: "forex" },
  { cls: "s3", sym: "AAPL", cat: "stk" },
  { cls: "s4", sym: "XAU/USD", cat: "cmd" },
  { cls: "s5", sym: "ETH", cat: "crypto" },
  { cls: "s6", sym: "GOOGL", cat: "stk" },
  { cls: "s7", sym: "USD/JPY", cat: "forex" },
  { cls: "s8", sym: "WTI", cat: "cmd" },
  { cls: "s9", sym: "SOL", cat: "crypto" },
  { cls: "s10", sym: "AMZN", cat: "stk" },
];

export const TickerAmbience = ({ className = "" }: TickerAmbienceProps) => {
  return (
    <div
      aria-hidden="true"
      className={`ticker-ambience pointer-events-none absolute inset-0 block ${className}`}
    >
      {/* Self-contained styles — palette, pill look, keyframes, positions,
          reduced-motion. */}
      <style>{`
        /* Category accent colours — WOT primary/accent purple + the cyan/pink
           screen accents + a tasteful gold for commodities. */
        .ticker-ambience {
          --t-forex:  #b366ff;
          --t-crypto: #2fe6ff;
          --t-stk:    #ff5db1;
          --t-cmd:    #f5b942;
        }

        /* The pill — dark translucent glass, matching the floating info cards. */
        .ticker-ambience .pill {
          position: absolute;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 9px;
          border-radius: 999px;
          white-space: nowrap;
          color: #e9e9f2;
          background: rgba(18, 18, 30, 0.72);
          border: 1px solid color-mix(in srgb, var(--t) 32%, rgba(255, 255, 255, 0.06));
          box-shadow: 0 6px 20px -8px rgba(0, 0, 0, 0.7);
          -webkit-backdrop-filter: blur(6px);
          backdrop-filter: blur(6px);
          opacity: 0;
          will-change: opacity, transform;
        }

        /* Per-category accent variable. */
        .ticker-ambience .forex  { --t: var(--t-forex); }
        .ticker-ambience .crypto { --t: var(--t-crypto); }
        .ticker-ambience .stk    { --t: var(--t-stk); }
        .ticker-ambience .cmd    { --t: var(--t-cmd); }

        /* Leading status dot in the category colour. */
        .ticker-ambience .pill .dot {
          flex: none;
          width: 5px;
          height: 5px;
          border-radius: 999px;
          background: var(--t);
          box-shadow: 0 0 6px -1px var(--t);
        }

        /* Ephemeral lifecycle: fade in → hold → fade out → stay hidden (the dead
           tail before looping spaces the pills out in time). Identical timing
           shape to the previous candlestick layer. */
        @keyframes ticker-life {
          0%   { opacity: 0;    transform: translateY(6px) scale(0.96); }
          12%  { opacity: 0.85; transform: translateY(0)    scale(1); }
          42%  { opacity: 0.85; transform: translateY(0)    scale(1); }
          60%  { opacity: 0;    transform: translateY(-6px) scale(0.98); }
          100% { opacity: 0;    transform: translateY(-6px) scale(0.98); }
        }

        /* Fixed slots scattered around the robot — corners (cards) + centre
           (face) deliberately left clear. Varied durations + negative delays
           keep only a couple of pills alive at any moment. */
        .ticker-ambience .s1  { top: 5%;  left: 28%; animation: ticker-life 11s ease-in-out infinite; }
        .ticker-ambience .s2  { top: 5%;  left: 56%; animation: ticker-life 13s ease-in-out -3s infinite; }
        .ticker-ambience .s3  { top: 44%; left: 1%;  animation: ticker-life 12s ease-in-out -7s infinite; }
        .ticker-ambience .s4  { top: 40%; left: 76%; animation: ticker-life 14s ease-in-out -5s infinite; }
        .ticker-ambience .s5  { top: 86%; left: 30%; animation: ticker-life 10s ease-in-out -2s infinite; }
        .ticker-ambience .s6  { top: 88%; left: 56%; animation: ticker-life 13s ease-in-out -9s infinite; }
        .ticker-ambience .s7  { top: 22%; left: 70%; animation: ticker-life 12s ease-in-out -11s infinite; }
        .ticker-ambience .s8  { top: 70%; left: 6%;  animation: ticker-life 11s ease-in-out -4s infinite; }
        .ticker-ambience .s9  { top: 16%; left: 12%; animation: ticker-life 14s ease-in-out -8s infinite; }
        .ticker-ambience .s10 { top: 60%; left: 82%; animation: ticker-life 13s ease-in-out -6s infinite; }

        /* --- Mobile portrait (< sm) -------------------------------------
           The stage is tiny and the four corner cards crowd it, so we keep a
           sparse subset (5 pills) tucked into the edge gaps between the cards,
           and HIDE the rest. Right-side pills are anchored from the RIGHT edge
           (left:auto) and left-side pills sit at low left% — guaranteeing no
           pill can overflow the viewport width. Slightly smaller padding too. */
        @media (max-width: 639px) {
          .ticker-ambience .pill { padding: 3px 7px; gap: 5px; }

          /* Hide the denser desktop-only slots on mobile. */
          .ticker-ambience .s1,
          .ticker-ambience .s6,
          .ticker-ambience .s7,
          .ticker-ambience .s9,
          .ticker-ambience .s10 { display: none; }

          /* Reposition the kept slots into the safe edge gaps. */
          .ticker-ambience .s2 { top: 3%;  left: 38%; right: auto; }  /* top-centre gap   */
          .ticker-ambience .s3 { top: 43%; left: 2%;  right: auto; }  /* mid-left edge     */
          .ticker-ambience .s4 { top: 37%; left: auto; right: 2%; }   /* mid-right edge    */
          .ticker-ambience .s5 { top: 90%; left: 36%; right: auto; }  /* bottom-centre gap */
          .ticker-ambience .s8 { top: 68%; left: 3%;  right: auto; }  /* lower-left edge   */
        }

        /* Accessibility: no ambient motion when reduced motion is requested. */
        @media (prefers-reduced-motion: reduce) {
          .ticker-ambience { display: none; }
        }
      `}</style>

      {PILLS.map((pill) => (
        <span
          key={pill.cls}
          className={`pill ${pill.cls} ${pill.cat} font-mono text-[0.6rem] font-semibold tracking-[0.08em]`}
        >
          <span className="dot" />
          {pill.sym}
        </span>
      ))}
    </div>
  );
};
