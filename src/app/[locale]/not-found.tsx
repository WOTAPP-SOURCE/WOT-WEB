import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const NotFoundPage = () => {
  const t = useTranslations("notFound");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <span className="bg-gradient-to-b from-primary to-accent bg-clip-text text-7xl font-bold text-transparent sm:text-8xl">
        {t("code")}
      </span>
      <h1 className="mt-6 text-2xl font-semibold text-text sm:text-3xl">{t("title")}</h1>
      <p className="mt-4 max-w-md text-sm text-text-muted sm:text-base">{t("description")}</p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-base font-medium text-white shadow-glow transition-all duration-200 hover:bg-accent hover:shadow-glow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {t("backHome")}
      </Link>
    </main>
  );
};

export default NotFoundPage;
