import type { ReceiptStatus } from "@/database.types";
import {
  intlLocaleTag,
  type AppLocale,
} from "@/core/i18n/config";
import { getDictionary } from "@/core/i18n/dictionary";
import { getLocale } from "@/core/i18n/locale";
import type { Dictionary } from "@/core/i18n/messages";
import { createSupabaseServerClient } from "@/core/supabase/server";
import { ReceiptProcessButton } from "@/features/receipts/receipt-process-button";
import { ReceiptUploadForm } from "@/features/receipts/receipt-upload-form";

type ReceiptSummaryRow = {
  id: string;
  status: ReceiptStatus;
  merchant: string | null;
  total: number | null;
  currency: string | null;
  created_at: string;
  extraction_error: string | null;
};

function statusLabel(status: ReceiptStatus, r: Dictionary["receipts"]) {
  switch (status) {
    case "pending":
      return r.statusPending;
    case "processing":
      return r.statusProcessing;
    case "complete":
      return r.statusComplete;
    case "failed":
      return r.statusFailed;
    default:
      return status;
  }
}

function ReceiptCard({
  row,
  dict,
  locale,
}: {
  row: ReceiptSummaryRow;
  dict: Dictionary;
  locale: AppLocale;
}) {
  const { receipts: r } = dict;
  const canExtract = row.status === "pending" || row.status === "failed";
  const totalLabel =
    row.total != null
      ? `${row.total.toFixed(2)} ${row.currency ?? ""}`.trim()
      : "—";

  return (
    <article className="rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <span className="font-medium">{statusLabel(row.status, r)}</span>
          <span className="text-sm text-zinc-700 dark:text-zinc-300">
            {totalLabel}
          </span>
        </div>
        {row.status === "failed" && row.extraction_error ? (
          <p className="text-xs text-red-600 dark:text-red-400">
            {row.extraction_error}
          </p>
        ) : null}
        <dl className="grid gap-2 text-sm">
          <div>
            <dt className="text-xs font-medium uppercase text-zinc-500">
              {r.merchant}
            </dt>
            <dd className="text-zinc-700 dark:text-zinc-300">
              {row.merchant ?? "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase text-zinc-500">
              {r.created}
            </dt>
            <dd className="text-xs text-zinc-500">
              {new Date(row.created_at).toLocaleString(intlLocaleTag(locale))}
            </dd>
          </div>
        </dl>
        <div className="flex justify-end border-t border-zinc-100 pt-3 dark:border-zinc-800/80">
          <ReceiptProcessButton receiptId={row.id} disabled={!canExtract} r={r} />
        </div>
      </div>
    </article>
  );
}

export async function ReceiptsPage() {
  const [dict, locale] = await Promise.all([getDictionary(), getLocale()]);
  const { receipts: r } = dict;

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return (
      <p className="text-sm text-red-600">{r.supabaseNotConfigured}</p>
    );
  }

  const { data: rows, error } = await supabase
    .from("receipts")
    .select(
      "id, status, merchant, total, currency, created_at, extraction_error",
    )
    .order("created_at", { ascending: false });

  if (error) {
    return <p className="text-sm text-red-600">{r.loadError}</p>;
  }

  const list = (rows ?? []) as ReceiptSummaryRow[];

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-6 sm:px-6 sm:py-8">
      <div>
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
          {r.title}
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          {r.subtitle}
        </p>
      </div>
      <ReceiptUploadForm r={r} />
      <section aria-label={r.listAria}>
        <div className="flex flex-col gap-3 md:hidden">
          {list.length ? (
            list.map((row) => (
              <ReceiptCard key={row.id} dict={dict} locale={locale} row={row} />
            ))
          ) : (
            <p className="rounded-2xl border border-dashed border-zinc-200 px-4 py-8 text-center text-sm text-zinc-500 dark:border-zinc-800">
              {r.empty}
            </p>
          )}
        </div>
        <div className="hidden overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800 md:block">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50 text-xs font-medium uppercase text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400">
              <tr>
                <th className="px-3 py-2">{r.tableStatus}</th>
                <th className="px-3 py-2">{r.tableMerchant}</th>
                <th className="px-3 py-2">{r.tableTotal}</th>
                <th className="px-3 py-2">{r.tableCreated}</th>
                <th className="px-3 py-2 text-right">{r.tableActions}</th>
              </tr>
            </thead>
            <tbody>
              {list.length ? (
                list.map((row) => {
                  const canExtract =
                    row.status === "pending" || row.status === "failed";
                  return (
                    <tr
                      key={row.id}
                      className="border-b border-zinc-100 last:border-0 dark:border-zinc-800/80"
                    >
                      <td className="px-3 py-2">
                        <span className="font-medium">
                          {statusLabel(row.status, r)}
                        </span>
                        {row.status === "failed" && row.extraction_error ? (
                          <p className="mt-1 max-w-xs text-xs text-red-600 dark:text-red-400">
                            {row.extraction_error}
                          </p>
                        ) : null}
                      </td>
                      <td className="px-3 py-2 text-zinc-700 dark:text-zinc-300">
                        {row.merchant ?? "—"}
                      </td>
                      <td className="px-3 py-2">
                        {row.total != null
                          ? `${row.total.toFixed(2)} ${row.currency ?? ""}`.trim()
                          : "—"}
                      </td>
                      <td className="px-3 py-2 text-xs text-zinc-500">
                        {new Date(row.created_at).toLocaleString(
                          intlLocaleTag(locale),
                        )}
                      </td>
                      <td className="px-3 py-2 text-right">
                        <ReceiptProcessButton
                          receiptId={row.id}
                          disabled={!canExtract}
                          r={r}
                        />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-3 py-8 text-center text-sm text-zinc-500"
                  >
                    {r.empty}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
