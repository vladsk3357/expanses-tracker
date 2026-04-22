"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { createSupabaseBrowserClient } from "@/core/supabase/client";

export function SignOutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function signOut() {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      return;
    }
    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
    router.refresh();
    router.push("/");
  }

  return (
    <button
      type="button"
      onClick={() => void signOut()}
      disabled={loading}
      className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full border border-zinc-300 px-4 text-sm font-medium text-foreground transition-colors hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-600 dark:hover:bg-zinc-800"
    >
      {loading ? "Signing out…" : "Sign out"}
    </button>
  );
}
