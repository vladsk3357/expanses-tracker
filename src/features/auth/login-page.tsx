"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { createSupabaseBrowserClient } from "@/core/supabase/client";

function safeNextParam(next: string | undefined): string | undefined {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return undefined;
  }
  return next;
}

export function LoginPage({
  oauthNext,
  serverError,
}: {
  oauthNext?: string;
  serverError?: string;
}) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(serverError ?? null);

  async function signInWithGoogle() {
    if (!supabase) {
      setMessage(
        "Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local, then restart the dev server.",
      );
      return;
    }

    setMessage(null);
    setLoading(true);
    const next = safeNextParam(oauthNext);
    const callback = new URL(`${window.location.origin}/auth/callback`);
    if (next) {
      callback.searchParams.set("next", next);
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: callback.toString(),
      },
    });
    setLoading(false);
    if (error) {
      setMessage(error.message);
    }
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      <div className="mx-auto flex w-full max-w-sm flex-col gap-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Use Google after enabling the provider and redirect URLs in the
            Supabase dashboard (local: http://localhost:3000/auth/callback).
          </p>
        </div>
        <button
          type="button"
          onClick={() => void signInWithGoogle()}
          disabled={loading}
          className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-6 text-sm font-medium text-background transition-colors hover:bg-zinc-800 disabled:opacity-60 dark:hover:bg-zinc-200"
        >
          {loading ? "Redirecting…" : "Continue with Google"}
        </button>
        {message ? (
          <p className="text-center text-sm text-red-600 dark:text-red-400">
            {message}
          </p>
        ) : null}
        <p className="text-center text-sm">
          <Link href="/" className="font-medium text-foreground underline">
            Back home
          </Link>
        </p>
      </div>
    </div>
  );
}
