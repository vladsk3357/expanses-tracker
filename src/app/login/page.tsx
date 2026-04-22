import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/core/supabase/server";
import { LoginPage } from "@/features/auth/login-page";

const errorMessages: Record<string, string> = {
  missing_code: "Missing authorization code. Try signing in again.",
  config: "Supabase is not configured on the server.",
  oauth: "Google sign-in failed. Check Supabase and redirect URLs.",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const supabase = await createSupabaseServerClient();
  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      redirect("/dashboard");
    }
  }

  const { next, error } = await searchParams;
  const serverError = error ? errorMessages[error] ?? error : undefined;

  return <LoginPage oauthNext={next} serverError={serverError} />;
}
