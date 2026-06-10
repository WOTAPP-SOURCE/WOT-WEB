# CLAUDE.md — WOT-WEB Project Instructions

> This file is read by Claude Code at the start of every session.
> It defines the architecture, conventions, and rules for this project.
> **Do not modify this file without explicit approval from the project owner.**

---

## Project Overview

**WOT (Way of Trading)** is a trading education mobile app (Flutter/Python) available on iOS and Android.
This repository (`wot-web`) is the **marketing website** — its sole purpose is to drive app downloads and build SEO authority through a multilingual trading glossary.

**This is Phase 1: marketing site only.**
- NO user authentication
- NO web checkout / payment
- NO connection to wot-api (the Python backend on AWS)
- NO dashboard or user account pages

If a prompt requests auth, checkout, Stripe, RevenueCat, or user dashboards → refuse and remind that these are Phase 2 deliverables.

---

## Tech Stack

| Layer          | Technology                        | Version   |
|----------------|-----------------------------------|-----------|
| Framework      | Next.js (App Router)              | 15.x      |
| Language       | TypeScript                        | 5.x       |
| Styling        | Tailwind CSS                      | 4.x       |
| Animations     | Framer Motion                     | 11.x      |
| Scroll/Motion   | GSAP + ScrollTrigger + Lenis      | 3.x / —   |
| i18n           | next-intl                         | 4.x       |
| Linting        | ESLint + Prettier                 | latest    |
| Package Mgr    | npm                               | —         |
| Deployment     | Vercel (auto-deploy on push)      | —         |

**Do NOT introduce additional frameworks, CSS libraries (no Bootstrap, Chakra, MUI), or state management (no Redux, Zustand). Tailwind + Framer Motion + GSAP/ScrollTrigger + Lenis + next-intl is the complete stack.**

> **Animation layer split (approved 2026-06-03):** GSAP + ScrollTrigger + Lenis (`@gsap/react`, `gsap`, `lenis`) drive the immersive homepage scroll choreography — pinning, scrubbed timelines, smooth scroll, SVG path draws, and counters. Framer Motion remains available for simple component-level enter/hover transitions. Do not add any further animation library (no Locomotive, no AOS).
>
> **3D / WebGL exception (approved 2026-06-04 by project owner):** React Three Fiber + drei + three (`@react-three/fiber`, `@react-three/drei`, `three`) are approved **solely** for discrete 3D set-pieces such as the Rewards-section coin rain. They must be loaded via `dynamic(..., { ssr: false })` so the WebGL bundle never enters the initial/server payload, and used sparingly to protect Core Web Vitals. Do not reach for Three.js as a general-purpose animation tool — GSAP/Framer remain the default for everything 2D.

---

## Brand Identity

| Property        | Value                                                      |
|-----------------|------------------------------------------------------------|
| Primary color   | `#941EFE` (purple)                                         |
| Font family     | **Poppins** (all weights: 300, 400, 500, 600, 700)        |
| Design mode     | **Dark-mode first** (light mode is secondary/optional)     |
| Mascot          | **Rudy** — the WOT AI coach robot character                |
| Tone            | Premium, modern, fintech — NOT playful/childish            |
| Domain          | `wayoftrading.com`                                         |
| App Store links | Apple App Store + Google Play (URLs TBD)                   |

### Color Tokens (Tailwind config)

```
primary:    #941EFE
background: #0A0A0F
surface:    #141420
border:     #1E1E2E
text:       #F5F5F7
text-muted: #8A8A9A
accent:     #B366FF
success:    #22C55E
warning:    #F59E0B
error:      #EF4444
```

These must be defined as CSS variables in `globals.css` AND as Tailwind theme extensions. Never use hardcoded hex values in components — always reference tokens.

---

## Architecture — Folder Structure

```
wot-web/
├── CLAUDE.md                          ← YOU ARE HERE
├── .claude/
│   ├── settings.json                  ← hooks configuration
│   └── hooks/                         ← hook scripts
├── public/
│   ├── images/
│   │   ├── screenshots/               ← app screenshots (phone mockups)
│   │   ├── mascot/                     ← Rudy assets
│   │   └── brand/                      ← logo, favicon, og-image
│   └── fonts/                          ← Poppins self-hosted .woff2
├── src/
│   ├── app/
│   │   ├── [locale]/                   ← i18n dynamic segment
│   │   │   ├── layout.tsx              ← root layout (fonts, metadata, providers)
│   │   │   ├── page.tsx                ← homepage
│   │   │   ├── features/
│   │   │   │   └── page.tsx
│   │   │   ├── pricing/
│   │   │   │   └── page.tsx
│   │   │   ├── glossary/
│   │   │   │   ├── page.tsx            ← glossary index (filterable, all terms)
│   │   │   │   └── [term]/
│   │   │   │       └── page.tsx        ← individual term page (SEO)
│   │   │   ├── faq/
│   │   │   │   └── page.tsx
│   │   │   └── about/
│   │   │       └── page.tsx
│   │   └── api/
│   │       └── contact/
│   │           └── route.ts            ← contact form handler
│   ├── components/
│   │   ├── ui/                         ← atomic reusable components
│   │   │   ├── Button.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   └── ...
│   │   ├── layout/                     ← structural components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Navigation.tsx
│   │   │   └── MobileMenu.tsx
│   │   ├── sections/                   ← homepage sections
│   │   │   ├── HeroSection.tsx
│   │   │   ├── FeaturesSection.tsx
│   │   │   ├── PhoneMockupSection.tsx
│   │   │   ├── TestimonialsSection.tsx
│   │   │   ├── PricingSection.tsx
│   │   │   ├── CTASection.tsx
│   │   │   └── ...
│   │   └── glossary/                   ← glossary-specific components
│   │       ├── GlossaryGrid.tsx
│   │       ├── GlossaryCard.tsx
│   │       ├── GlossaryFilter.tsx
│   │       ├── TermContent.tsx
│   │       └── CategoryBadge.tsx
│   ├── data/
│   │   └── glossary/
│   │       ├── en.json                 ← 288 terms English
│   │       ├── fr.json                 ← 288 terms French
│   │       └── es.json                 ← 288 terms Spanish
│   ├── lib/
│   │   ├── utils.ts                    ← shared utility functions
│   │   ├── constants.ts               ← app-wide constants
│   │   └── glossary.ts                ← glossary data helpers (getTermBySlug, etc.)
│   ├── hooks/                          ← React custom hooks
│   │   ├── useScrollAnimation.ts
│   │   └── useMediaQuery.ts
│   ├── types/
│   │   ├── glossary.ts                 ← GlossaryTerm, GlossaryCategory types
│   │   └── index.ts                    ← shared types
│   └── i18n/
│       ├── request.ts                  ← next-intl server config
│       ├── routing.ts                  ← locale routing config
│       └── messages/
│           ├── en.json                 ← UI translations English
│           ├── fr.json                 ← UI translations French
│           └── es.json                 ← UI translations Spanish
├── tailwind.config.ts
├── next.config.ts
├── tsconfig.json
├── package.json
└── .prettierrc
```

**Rules:**
- Every new component goes in the correct subfolder. No loose files in `components/`.
- `ui/` = stateless, reusable, style-only. No business logic.
- `sections/` = page sections, compose `ui/` components. Used once per page.
- `glossary/` = glossary-specific components. Can use `ui/` components.
- Pages are thin: import sections, compose layout. No inline JSX walls in page files.

---

## Coding Conventions

### TypeScript
- Strict mode enabled (`"strict": true` in tsconfig).
- All props must have explicit interfaces — no `any`, no implicit types.
- Interface names: `PascalCase` with descriptive suffix → `HeroSectionProps`, `GlossaryTermData`.
- Export types from `types/` — never define shared types inline in components.
- **Use early returns** for readability — handle edge cases and guard clauses at the top, avoid deep nesting.

```tsx
// ✅ CORRECT — early return
const TermPage = ({ term }: TermPageProps) => {
  if (!term) return <NotFound />;
  if (!term.extended) return <ShortDefinition term={term} />;

  return <FullTermContent term={term} />;
};

// ❌ WRONG — deep nesting
const TermPage = ({ term }: TermPageProps) => {
  if (term) {
    if (term.extended) {
      return <FullTermContent term={term} />;
    } else {
      return <ShortDefinition term={term} />;
    }
  } else {
    return <NotFound />;
  }
};
```

### Components
- **Functional components only** with arrow function syntax.
- **One component per file.** File name = component name (PascalCase).
- Default exports for page components, named exports for everything else.
- Props destructured in function signature.

```tsx
// ✅ CORRECT
interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export const FeatureCard = ({ title, description, icon }: FeatureCardProps) => {
  return (
    <div className="rounded-xl border border-border bg-surface p-6">
      {icon}
      <h3 className="mt-4 text-lg font-semibold text-text">{title}</h3>
      <p className="mt-2 text-sm text-text-muted">{description}</p>
    </div>
  );
};

// ❌ WRONG — no interface, inline types, function declaration
export default function FeatureCard(props: { title: string }) { ... }
```

### Styling
- **Tailwind utility classes only.** No CSS modules, no styled-components, no inline `style={}`.
- Use design tokens via Tailwind (`bg-surface`, `text-primary`, `border-border`), never raw hex.
- Complex conditional classes: use `clsx` or `cn()` helper (Tailwind merge).
- Responsive: mobile-first (`base` → `md:` → `lg:` → `xl:`).
- Max content width: `max-w-7xl mx-auto`.

### Animations
- Use Framer Motion for scroll-triggered animations, page transitions, and interactive elements.
- Define animation variants as constants outside the component, not inline.
- Keep animations performant: transform and opacity only. No layout-triggering animations.

```tsx
// ✅ CORRECT — variants defined outside
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export const HeroSection = () => {
  return (
    <motion.section variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
      ...
    </motion.section>
  );
};
```

### Naming
- Files/folders: `PascalCase` for components, `camelCase` for utilities/hooks/lib.
- CSS classes: Tailwind utilities (no custom class names unless absolutely necessary).
- Constants: `UPPER_SNAKE_CASE`.
- Functions: `camelCase`, verb-first (`getTermBySlug`, `formatCategoryName`).
- Boolean props: `is`/`has` prefix (`isActive`, `hasIcon`).

### Imports
- Absolute imports with `@/` alias (configured in tsconfig paths).
- Order: (1) React/Next.js, (2) external libs, (3) `@/components`, (4) `@/lib`, (5) `@/types`, (6) relative.
- No barrel exports (`index.ts` re-exports) — import directly from the file.

---

## SEO — Glossary (Critical)

The glossary is the #1 SEO asset. 288 trading terms × 3 languages = ~864 statically generated pages.

### Implementation Requirements
- Each term page at `/[locale]/glossary/[term]` is statically generated at build time via `generateStaticParams`.
- Every term page must have: unique `<title>`, `<meta description>`, structured data (`DefinedTerm` schema.org).
- The glossary index at `/[locale]/glossary` is a single filterable page — alphabetical filter + category filter + search. No pagination, no page changes.
- Internal linking: each term page links to related terms within the glossary.
- CTA on every term page: "Learn this in practice with Rudy, your AI coach" → app store links.

### Glossary Data Format
```json
{
  "slug": "pip",
  "term": "Pip",
  "category": "forex-basics",
  "definition": "Short definition here...",
  "extended": "2-3 paragraphs of educational content for SEO depth...",
  "related": ["spread", "lot", "leverage"]
}
```

**Claude Code responsibility:** when creating glossary pages, always generate `extended` content that is educational, accurate, and at least 150 words. Thin content (definition-only) will be penalized by Google.

---

## i18n Rules

- Default locale: `fr` (French market is primary).
- Supported locales: `fr`, `en`, `es`.
- All user-facing strings go in `src/i18n/messages/{locale}.json` — never hardcode text in components.
- Glossary data has its own separate JSON files in `src/data/glossary/{locale}.json`.
- URL structure: `/fr/glossary/pip`, `/en/glossary/pip`, `/es/glossary/pip`.
- `<html lang>` and `hreflang` tags must be correct on every page.

---

## Performance Rules

- Images: use `next/image` with proper `width`, `height`, and `alt`. No raw `<img>` tags.
- Fonts: self-host Poppins via `next/font/local` — do NOT load from Google Fonts CDN.
- Core Web Vitals targets: LCP < 2.5s, CLS < 0.1, INP < 200ms.
- Lazy load below-fold sections with `dynamic()` or intersection observer.
- No client-side fetching on marketing pages — everything is static or server-rendered.

---

## Git Conventions

- Branch: work on `main` (solo developer, Phase 1).
- Commit messages: conventional commits format.
  - `feat: add glossary index page`
  - `fix: correct mobile navigation z-index`
  - `style: adjust hero section spacing`
  - `chore: update dependencies`
- Push frequently. Every push triggers Vercel auto-deploy.

---

## Commands

```bash
npm run dev          # Local dev server (http://localhost:3000)
npm run build        # Production build (also validates TypeScript + ESLint)
npm run start        # Serve production build locally
npm run lint         # ESLint check
npm run format       # Prettier format all files
npm run test         # Run tests (Vitest)
npm run test:watch   # Run tests in watch mode
```

**Claude Code must run `npm run build` before committing** to catch TypeScript errors and build failures early. A commit that breaks the build breaks the Vercel auto-deploy.

---

## Testing

- Test framework: **Vitest** + **React Testing Library** (installed but not mandatory for every component in Phase 1).
- Tests are **co-located** with the code they test: `__tests__/` folder next to the source files.
- File naming: `ComponentName.test.tsx` or `utilName.test.ts`.
- **TDD is NOT required** in Phase 1 — this is a marketing site, not business logic. Write tests for:
  - Utility functions in `lib/` (glossary helpers, formatters)
  - Complex interactive components (filters, search)
  - i18n: spot-check that key translations render correctly
- Do NOT write tests for static sections (HeroSection, CTASection) — it's wasted effort.

```
src/
├── lib/
│   ├── glossary.ts
│   └── __tests__/
│       └── glossary.test.ts       ← test the helper functions
├── components/
│   └── glossary/
│       ├── GlossaryFilter.tsx
│       └── __tests__/
│           └── GlossaryFilter.test.tsx  ← test interactive behavior
```

---

## What Claude Code Must NEVER Do

1. **Install unauthorized packages.** Only packages listed in the Tech Stack section. Ask before adding anything else.
2. **Create files outside the defined folder structure.** Follow the architecture exactly.
3. **Use `any` type.** Ever.
4. **Hardcode text in components.** All strings go through next-intl.
5. **Use CSS modules, styled-components, or inline styles.** Tailwind only.
6. **Add authentication, payment, or user account features.** Phase 2.
7. **Modify `.env*` files, `package-lock.json`, or `.git/` directly.**
8. **Run `rm -rf`, `git push --force`, or any destructive command.**
9. **Create god-components** (files > 200 lines). Split into smaller components.
10. **Skip TypeScript interfaces.** Every component has explicit typed props.

---

## Development Workflow

When starting a new feature:
1. Identify which folder(s) the new files belong in.
2. Create the TypeScript interface first.
3. Build the component with placeholder content.
4. Add i18n strings to all 3 locale files.
5. Wire up Framer Motion animations.
6. Test responsive (mobile-first).
7. Commit with a descriptive message.

When editing existing code:
1. Read the existing file completely before making changes.
2. Maintain existing patterns and naming conventions.
3. Do not refactor unrelated code in the same commit.
