"use server";

import { cookies } from "next/headers";

import { APP_LOCALES, LOCALE_COOKIE, type AppLocale } from "@/core/i18n/config";

export async function setAppLocale(locale: AppLocale) {
  if (!APP_LOCALES.includes(locale)) {
    return;
  }
  const jar = await cookies();
  jar.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
}
