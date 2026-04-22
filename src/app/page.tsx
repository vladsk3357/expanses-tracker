import { createSupabaseServerClient } from "@/core/supabase/server";
import { HomePage } from "@/features/home/home-page";

export default async function Page() {
  const supabase = await createSupabaseServerClient();
  const user = supabase
    ? (await supabase.auth.getUser()).data.user
    : null;

  return <HomePage isSignedIn={!!user} />;
}
