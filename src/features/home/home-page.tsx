import Link from "next/link";

export function HomePage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <div className="mx-auto flex w-full max-w-md flex-col gap-6 text-center">
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Expense tracker
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Scan receipts. Track spending.
        </h1>
        <p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          Upload receipts, extract line items with AI, and see summaries—all in
          a mobile-first PWA.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/login"
            className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-6 text-sm font-medium text-background transition-colors hover:bg-zinc-800 dark:hover:bg-zinc-200"
          >
            Sign in with Google
          </Link>
        </div>
      </div>
    </div>
  );
}
