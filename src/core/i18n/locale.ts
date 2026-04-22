import { cache } from "react";
import { cookies } from "next/headers";

import {
  APP_LOCALES,
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  type AppLocale,
} from "@/core/i18n/config";

function parseLocale(raw: string | undefined): AppLocale {
  if (raw && APP_LOCALES.includes(raw as AppLocale)) {
    return raw as AppLocale;
  }
  return DEFAULT_LOCALE;
}

export const getLocale = cache(async (): Promise<AppLocale> => {
  const jar = await cookies();
  return parseLocale(jar.get(LOCALE_COOKIE)?.value);
});
