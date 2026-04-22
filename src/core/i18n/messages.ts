import type { AppLocale } from "@/core/i18n/config";

const en = {
  meta: {
    titleDefault: "Expense tracker",
    titleSuffix: "Expense tracker",
    description:
      "Receipt scanning, categorization, and spending insights.",
    manifestName: "Expense tracker",
    manifestShortName: "Expenses",
    manifestDescription: "Receipt scanning and spending insights.",
  },
  home: {
    badge: "Expense tracker",
    title: "Scan receipts. Track spending.",
    description:
      "Upload receipts, extract line items with AI, and see summaries—all in a mobile-first PWA.",
    ctaDashboard: "Go to dashboard",
    ctaSignIn: "Sign in with Google",
  },
  dashboard: {
    title: "Dashboard",
    subtitle:
      "You are signed in. Upload receipts or review spending from the links below.",
    receipts: "Receipts",
    statistics: "Statistics",
  },
  nav: {
    mainAria: "Main",
    dashboard: "Dashboard",
    receipts: "Receipts",
    statistics: "Statistics",
  },
  login: {
    title: "Sign in",
    hint: "Use Google after enabling the provider and redirect URLs in the Supabase dashboard (local: http://localhost:3000/auth/callback).",
    continue: "Continue with Google",
    redirecting: "Redirecting…",
    backHome: "Back home",
    envHint:
      "Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local, then restart the dev server.",
  },
  loginErrors: {
    missing_code: "Missing authorization code. Try signing in again.",
    config: "Supabase is not configured on the server.",
    oauth: "Google sign-in failed. Check Supabase and redirect URLs.",
  },
  signOut: {
    label: "Sign out",
    loading: "Signing out…",
  },
  receipts: {
    title: "Receipts",
    subtitle:
      "Upload a photo, then run AI extraction. Data stays in your Supabase project with row-level security.",
    supabaseNotConfigured: "Supabase is not configured.",
    loadError:
      "Could not load receipts. Apply database migrations in Supabase, then refresh.",
    listAria: "Receipt list",
    empty: "No receipts yet. Upload one above.",
    statusPending: "Pending",
    statusProcessing: "Processing",
    statusComplete: "Complete",
    statusFailed: "Failed",
    merchant: "Merchant",
    created: "Created",
    tableStatus: "Status",
    tableMerchant: "Merchant",
    tableTotal: "Total",
    tableCreated: "Created",
    tableActions: "Actions",
    uploadTitle: "Upload receipt",
    uploadHint:
      "Camera or gallery — JPEG, PNG, WebP, or HEIC, up to 10MB.",
    uploadButton: "Take photo or choose file",
    uploadPending: "Uploading…",
    uploadSaving: "Saving your receipt…",
    uploadFailed: "Upload failed.",
    extract: "Extract with AI",
    extracting: "Extracting…",
    extractionFailed: "Extraction failed.",
  },
  statistics: {
    title: "Statistics",
    subtitle: "Spend by category from completed receipts (database view).",
    supabaseNotConfigured: "Supabase is not configured.",
    loadError:
      "Could not load statistics. Ensure migrations are applied and completed receipts exist.",
    totalLabel: "Total (completed)",
    empty: "No completed line items yet. Extract a receipt first.",
    category: "Category",
    amount: "Amount",
    lines: "Lines",
  },
  language: {
    label: "Language",
    english: "English",
    ukrainian: "Українська",
  },
  actions: {
    supabaseNotConfigured: "Supabase is not configured.",
    mustBeSignedIn: "You must be signed in.",
    chooseImage: "Choose an image file to upload.",
    fileTooLarge: "Image must be 10MB or smaller.",
    invalidMime: "Use a JPEG, PNG, WebP, or HEIC image.",
    couldNotSaveReceipt: "Could not save receipt.",
    receiptNotFound: "Receipt not found.",
    receiptNotPending: "This receipt is not waiting for extraction.",
    couldNotReadImage: "Could not read the image.",
    extractionFailed: "Extraction failed.",
  },
};

export type Dictionary = typeof en;

const uk: Dictionary = {
  meta: {
    titleDefault: "Облік витрат",
    titleSuffix: "Облік витрат",
    description:
      "Сканування чеків, категорії та аналітика витрат.",
    manifestName: "Облік витрат",
    manifestShortName: "Витрати",
    manifestDescription: "Сканування чеків і аналітика витрат.",
  },
  home: {
    badge: "Облік витрат",
    title: "Скануйте чеки. Контролюйте витрати.",
    description:
      "Завантажуйте чеки, добувайте позиції за допомогою ШІ та переглядайте підсумки — у зручному для мобільних PWA.",
    ctaDashboard: "До панелі",
    ctaSignIn: "Увійти через Google",
  },
  dashboard: {
    title: "Панель",
    subtitle:
      "Ви увійшли. Завантажуйте чеки або переглядайте витрати за посиланнями нижче.",
    receipts: "Чеки",
    statistics: "Статистика",
  },
  nav: {
    mainAria: "Головне меню",
    dashboard: "Панель",
    receipts: "Чеки",
    statistics: "Статистика",
  },
  login: {
    title: "Вхід",
    hint: "Використайте Google після увімкнення провайдера та redirect URL у кабінеті Supabase (локально: http://localhost:3000/auth/callback).",
    continue: "Продовжити з Google",
    redirecting: "Перенаправлення…",
    backHome: "На головну",
    envHint:
      "Додайте NEXT_PUBLIC_SUPABASE_URL і NEXT_PUBLIC_SUPABASE_ANON_KEY у .env.local і перезапустіть dev-сервер.",
  },
  loginErrors: {
    missing_code: "Немає коду авторизації. Спробуйте увійти знову.",
    config: "Supabase не налаштовано на сервері.",
    oauth: "Вхід через Google не вдався. Перевірте Supabase та redirect URL.",
  },
  signOut: {
    label: "Вийти",
    loading: "Вихід…",
  },
  receipts: {
    title: "Чеки",
    subtitle:
      "Завантажте фото, потім запустіть витяг даних ШІ. Дані зберігаються у вашому проєкті Supabase з RLS.",
    supabaseNotConfigured: "Supabase не налаштовано.",
    loadError:
      "Не вдалося завантажити чеки. Застосуйте міграції в Supabase і оновіть сторінку.",
    listAria: "Список чеків",
    empty: "Ще немає чеків. Завантажте один вище.",
    statusPending: "Очікує",
    statusProcessing: "Обробка",
    statusComplete: "Готово",
    statusFailed: "Помилка",
    merchant: "Продавець",
    created: "Створено",
    tableStatus: "Статус",
    tableMerchant: "Продавець",
    tableTotal: "Сума",
    tableCreated: "Створено",
    tableActions: "Дії",
    uploadTitle: "Завантажити чек",
    uploadHint:
      "Камера або галерея — JPEG, PNG, WebP або HEIC, до 10 МБ.",
    uploadButton: "Зробити фото або обрати файл",
    uploadPending: "Завантаження…",
    uploadSaving: "Зберігаємо чек…",
    uploadFailed: "Не вдалося завантажити.",
    extract: "Витягнути за допомогою ШІ",
    extracting: "Витяг…",
    extractionFailed: "Витяг даних не вдався.",
  },
  statistics: {
    title: "Статистика",
    subtitle: "Витрати за категоріями з оброблених чеків (представлення в БД).",
    supabaseNotConfigured: "Supabase не налаштовано.",
    loadError:
      "Не вдалося завантажити статистику. Переконайтеся, що міграції застосовано та є готові чеки.",
    totalLabel: "Усього (оброблені)",
    empty: "Ще немає позицій з готових чеків. Спочатку обробіть чек.",
    category: "Категорія",
    amount: "Сума",
    lines: "Рядки",
  },
  language: {
    label: "Мова",
    english: "English",
    ukrainian: "Українська",
  },
  actions: {
    supabaseNotConfigured: "Supabase не налаштовано.",
    mustBeSignedIn: "Потрібно увійти.",
    chooseImage: "Оберіть файл зображення для завантаження.",
    fileTooLarge: "Зображення має бути не більше 10 МБ.",
    invalidMime: "Використайте JPEG, PNG, WebP або HEIC.",
    couldNotSaveReceipt: "Не вдалося зберегти чек.",
    receiptNotFound: "Чек не знайдено.",
    receiptNotPending: "Цей чек не очікує витягу даних.",
    couldNotReadImage: "Не вдалося прочитати зображення.",
    extractionFailed: "Витяг даних не вдався.",
  },
};

const table: Record<AppLocale, Dictionary> = { en, uk };

export function getMessages(locale: AppLocale): Dictionary {
  return table[locale];
}
