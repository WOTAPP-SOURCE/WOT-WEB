import { useTranslations } from "next-intl";

/*
 * Infinite horizontal ticker. The item list is rendered twice inside one flex
 * track; the track translates exactly one copy width (-50%) on an endless CSS
 * loop, so the seam is invisible. A mask fades both edges. Mono, all-caps —
 * a technical "stock ticker" feel between the hero and the feature panels.
 */
export const MarqueeTicker = () => {
  const t = useTranslations("marquee");
  const items = t.raw("items") as string[];

  return (
    <section
      aria-hidden="true"
      className="relative overflow-hidden border-y border-[#B86BFF]/[0.18] bg-[#941EFE]/[0.04] py-5"
    >
      <div className="[mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
        <div className="animate-marquee flex w-max items-center whitespace-nowrap">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex items-center">
              {items.map((item, i) => (
                <div key={`${copy}-${i}`} className="flex items-center">
                  <span className="text-text-muted font-mono text-sm tracking-[0.18em] uppercase">
                    {item}
                  </span>
                  <span className="text-primary mx-6 text-xs">●</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
