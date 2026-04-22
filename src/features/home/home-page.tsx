import Link from "next/link";

import type { AppLocale } from "@/core/i18n/config";
import type { Dictionary } from "@/core/i18n/messages";
import { LanguageSwitcher } from "@/features/i18n/language-switcher";

export function HomePage({
  dict,
  isSignedIn,
  locale,
}: {
  dict: Dictionary;
  isSignedIn: boolean;
  locale: AppLocale;
}) {
  const { home, language } = dict;

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <div className="mx-auto flex w-full max-w-md flex-col gap-6 text-center">
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          {home.badge}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          {home.title}
        </h1>
        <p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          {home.description}
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          {isSignedIn ? (
            <Link
              href="/dashboard"
              className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-6 text-sm font-medium text-background transition-colors hover:bg-zinc-800 dark:hover:bg-zinc-200"
            >
              {home.ctaDashboard}
            </Link>
          ) : (
            <Link
              href="/login"
              className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-6 text-sm font-medium text-background transition-colors hover:bg-zinc-800 dark:hover:bg-zinc-200"
            >
              {home.ctaSignIn}
            </Link>
          )}
        </div>
        <div className="flex justify-center pt-2">
          <LanguageSwitcher locale={locale} labels={language} />
        </div>
      </div>
    </div>
  );
}
