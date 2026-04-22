import { getDictionary } from "@/core/i18n/dictionary";
import { getLocale } from "@/core/i18n/locale";
import { createSupabaseServerClient } from "@/core/supabase/server";
import { HomePage } from "@/features/home/home-page";

export default async function Page() {
  const supabase = await createSupabaseServerClient();
  const user = supabase
    ? (await supabase.auth.getUser()).data.user
    : null;

  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);

  return <HomePage dict={dict} isSignedIn={!!user} locale={locale} />;
}
