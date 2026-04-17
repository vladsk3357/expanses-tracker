"use client";

import { createBrowserClient } from "@supabase/ssr";

import { getSupabasePublicEnv } from "@/core/supabase/env";

export function createSupabaseBrowserClient() {
  const env = getSupabasePublicEnv();
  if (!env) {
    return null;
  }

  return createBrowserClient(env.url, env.anonKey);
}
