import "./globals.css";
import { routing } from "@/i18n/routing";

/*
 * Root-level fallback for paths that never reach the [locale] segment
 * (e.g. a malformed URL without a locale prefix). It must render its own
 * <html>/<body> because no layout wraps the app-root not-found boundary.
 * Localized 404s are handled by src/app/[locale]/not-found.tsx instead.
 */
const RootNotFound = () => {
  return (
    <html lang={routing.defaultLocale}>
      <body>
        <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
          <span className="bg-gradient-to-b from-primary to-accent bg-clip-text text-7xl font-bold text-transparent sm:text-8xl">
            404
          </span>
          <h1 className="mt-6 text-2xl font-semibold text-text sm:text-3xl">Page introuvable</h1>
          <p className="mt-4 max-w-md text-sm text-text-muted sm:text-base">
            La page que vous recherchez n&apos;existe pas ou a été déplacée.
          </p>
          <a
            href={`/${routing.defaultLocale}`}
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-base font-medium text-white shadow-glow transition-all duration-200 hover:bg-accent hover:shadow-glow-lg"
          >
            Retour à l&apos;accueil
          </a>
        </main>
      </body>
    </html>
  );
};

export default RootNotFound;
