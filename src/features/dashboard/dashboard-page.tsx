import Link from "next/link";

import type { Dictionary } from "@/core/i18n/messages";

export function DashboardPage({ dict }: { dict: Dictionary }) {
  const { dashboard } = dict;

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6 px-4 py-6 sm:px-6 sm:py-10">
      <div>
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
          {dashboard.title}
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          {dashboard.subtitle}
        </p>
      </div>
      <ul className="flex flex-col gap-1 text-sm font-medium sm:gap-2">
        <li>
          <Link
            href="/receipts"
            className="inline-flex min-h-11 items-center text-foreground underline underline-offset-4"
          >
            {dashboard.receipts}
          </Link>
        </li>
        <li>
          <Link
            href="/statistics"
            className="inline-flex min-h-11 items-center text-foreground underline underline-offset-4"
          >
            {dashboard.statistics}
          </Link>
        </li>
      </ul>
    </div>
  );
}
