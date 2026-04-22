import Link from "next/link";
import type { User } from "@supabase/supabase-js";

import { SignOutButton } from "@/features/auth/sign-out-button";

const navLinkClass =
  "inline-flex min-h-11 shrink-0 items-center text-sm font-medium text-zinc-600 hover:text-foreground dark:text-zinc-400";

export function AppShell({
  user,
  children,
}: {
  user: User;
  children: React.ReactNode;
}) {
  const label = user.email ?? user.id;

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="flex flex-col gap-3 border-b border-zinc-200 px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] dark:border-zinc-800 md:flex-row md:items-center md:justify-between md:gap-4 md:pt-3">
        <nav
          className="-mx-4 flex flex-nowrap items-center gap-1 overflow-x-auto px-4 [scrollbar-width:none] md:mx-0 md:gap-4 md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden"
          aria-label="Main"
        >
          <Link
            href="/dashboard"
            className="inline-flex min-h-11 shrink-0 items-center text-sm font-medium text-foreground"
          >
            Dashboard
          </Link>
          <Link href="/receipts" className={navLinkClass}>
            Receipts
          </Link>
          <Link href="/statistics" className={navLinkClass}>
            Statistics
          </Link>
        </nav>
        <div className="flex min-h-11 w-full items-center justify-between gap-3 md:w-auto md:justify-end">
          <span className="min-w-0 flex-1 truncate text-xs text-zinc-500 dark:text-zinc-400 md:max-w-[12rem] md:flex-none">
            {label}
          </span>
          <SignOutButton />
        </div>
      </header>
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
