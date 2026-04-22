import { cache } from "react";

import { getLocale } from "@/core/i18n/locale";
import { getMessages, type Dictionary } from "@/core/i18n/messages";

export const getDictionary = cache(async (): Promise<Dictionary> => {
  const locale = await getLocale();
  return getMessages(locale);
});
