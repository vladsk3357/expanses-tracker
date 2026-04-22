import type { ReceiptStatus } from "@/database.types";
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

function statusLabel(status: ReceiptStatus) {
  switch (status) {
    case "pending":
      return "Pending";
    case "processing":
      return "Processing";
    case "complete":
      return "Complete";
    case "failed":
      return "Failed";
    default:
      return status;
  }
}

function ReceiptCard({ row }: { row: ReceiptSummaryRow }) {
  const canExtract = row.status === "pending" || row.status === "failed";
  const totalLabel =
    row.total != null
      ? `${row.total.toFixed(2)} ${row.currency ?? ""}`.trim()
      : "—";

  return (
    <article className="rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <span className="font-medium">{statusLabel(row.status)}</span>
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
              Merchant
            </dt>
            <dd className="text-zinc-700 dark:text-zinc-300">
              {row.merchant ?? "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase text-zinc-500">
              Created
            </dt>
            <dd className="text-xs text-zinc-500">
              {new Date(row.created_at).toLocaleString()}
            </dd>
          </div>
        </dl>
        <div className="flex justify-end border-t border-zinc-100 pt-3 dark:border-zinc-800/80">
          <ReceiptProcessButton receiptId={row.id} disabled={!canExtract} />
        </div>
      </div>
    </article>
  );
}

export async function ReceiptsPage() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return <p className="text-sm text-red-600">Supabase is not configured.</p>;
  }

  const { data: rows, error } = await supabase
    .from("receipts")
    .select(
      "id, status, merchant, total, currency, created_at, extraction_error",
    )
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <p className="text-sm text-red-600">
        Could not load receipts. Apply database migrations in Supabase, then
        refresh.
      </p>
    );
  }

  const list = (rows ?? []) as ReceiptSummaryRow[];

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-6 sm:px-6 sm:py-8">
      <div>
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Receipts
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Upload a photo, then run AI extraction. Data stays in your Supabase
          project with row-level security.
        </p>
      </div>
      <ReceiptUploadForm />
      <section aria-label="Receipt list">
        <div className="flex flex-col gap-3 md:hidden">
          {list.length ? (
            list.map((r) => <ReceiptCard key={r.id} row={r} />)
          ) : (
            <p className="rounded-2xl border border-dashed border-zinc-200 px-4 py-8 text-center text-sm text-zinc-500 dark:border-zinc-800">
              No receipts yet. Upload one above.
            </p>
          )}
        </div>
        <div className="hidden overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800 md:block">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50 text-xs font-medium uppercase text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400">
              <tr>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Merchant</th>
                <th className="px-3 py-2">Total</th>
                <th className="px-3 py-2">Created</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.length ? (
                list.map((r) => {
                  const canExtract =
                    r.status === "pending" || r.status === "failed";
                  return (
                    <tr
                      key={r.id}
                      className="border-b border-zinc-100 last:border-0 dark:border-zinc-800/80"
                    >
                      <td className="px-3 py-2">
                        <span className="font-medium">
                          {statusLabel(r.status)}
                        </span>
                        {r.status === "failed" && r.extraction_error ? (
                          <p className="mt-1 max-w-xs text-xs text-red-600 dark:text-red-400">
                            {r.extraction_error}
                          </p>
                        ) : null}
                      </td>
                      <td className="px-3 py-2 text-zinc-700 dark:text-zinc-300">
                        {r.merchant ?? "—"}
                      </td>
                      <td className="px-3 py-2">
                        {r.total != null
                          ? `${r.total.toFixed(2)} ${r.currency ?? ""}`.trim()
                          : "—"}
                      </td>
                      <td className="px-3 py-2 text-xs text-zinc-500">
                        {new Date(r.created_at).toLocaleString()}
                      </td>
                      <td className="px-3 py-2 text-right">
                        <ReceiptProcessButton
                          receiptId={r.id}
                          disabled={!canExtract}
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
                    No receipts yet. Upload one above.
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
