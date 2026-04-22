import { getDictionary } from "@/core/i18n/dictionary";
import { DashboardPage } from "@/features/dashboard/dashboard-page";

export default async function Page() {
  const dict = await getDictionary();
  return <DashboardPage dict={dict} />;
}
