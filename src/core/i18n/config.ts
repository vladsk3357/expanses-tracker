export type AppLocale = "en" | "uk";

export const APP_LOCALES: AppLocale[] = ["en", "uk"];

export const DEFAULT_LOCALE: AppLocale = "en";

export const LOCALE_COOKIE = "app-locale";

export function intlLocaleTag(locale: AppLocale): string {
  return locale === "uk" ? "uk-UA" : "en-US";
}
