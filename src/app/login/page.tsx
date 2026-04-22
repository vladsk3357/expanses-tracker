import { redirect } from "next/navigation";

import { getDictionary } from "@/core/i18n/dictionary";
import { getLocale } from "@/core/i18n/locale";
import { createSupabaseServerClient } from "@/core/supabase/server";
import { LoginPage } from "@/features/auth/login-page";

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

  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);
  const { next, error } = await searchParams;
  const errorMessages: Record<string, string> = {
    missing_code: dict.loginErrors.missing_code,
    config: dict.loginErrors.config,
    oauth: dict.loginErrors.oauth,
  };
  const serverError = error ? errorMessages[error] ?? error : undefined;

  return (
    <LoginPage
      dict={dict}
      locale={locale}
      oauthNext={next}
      serverError={serverError}
    />
  );
}
