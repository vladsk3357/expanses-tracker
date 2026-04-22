"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { setAppLocale } from "@/core/i18n/actions";
import type { AppLocale } from "@/core/i18n/config";
import type { Dictionary } from "@/core/i18n/messages";

export function LanguageSwitcher({
  locale,
  labels,
}: {
  locale: AppLocale;
  labels: Dictionary["language"];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function select(next: AppLocale) {
    if (next === locale) {
      return;
    }
    startTransition(async () => {
      await setAppLocale(next);
      router.refresh();
    });
  }

  return (
    <div
      className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400"
      role="group"
      aria-label={labels.label}
    >
      <span className="sr-only">{labels.label}</span>
      <button
        type="button"
        disabled={pending}
        onClick={() => select("en")}
        className={
          locale === "en"
            ? "font-semibold text-foreground"
            : "underline-offset-2 hover:underline"
        }
      >
        {labels.english}
      </button>
      <span aria-hidden className="text-zinc-300 dark:text-zinc-600">
        ·
      </span>
      <button
        type="button"
        disabled={pending}
        onClick={() => select("uk")}
        className={
          locale === "uk"
            ? "font-semibold text-foreground"
            : "underline-offset-2 hover:underline"
        }
      >
        {labels.ukrainian}
      </button>
    </div>
  );
}
