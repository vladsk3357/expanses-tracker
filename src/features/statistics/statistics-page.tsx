import { createSupabaseServerClient } from "@/core/supabase/server";

export async function StatisticsPage() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return <p className="text-sm text-red-600">Supabase is not configured.</p>;
  }

  const { data: rows, error } = await supabase
    .from("receipt_category_totals")
    .select("category, total_amount, line_count")
    .order("total_amount", { ascending: false });

  if (error) {
    return (
      <p className="text-sm text-red-600">
        Could not load statistics. Ensure migrations are applied and completed
        receipts exist.
      </p>
    );
  }

  const grandTotal =
    rows?.reduce((s, r) => s + Number(r.total_amount ?? 0), 0) ?? 0;

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-8 px-4 py-6 sm:px-6 sm:py-8">
      <div>
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Statistics
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Spend by category from completed receipts (database view).
        </p>
      </div>
      <div className="rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
        <p className="text-xs font-medium uppercase text-zinc-500">
          Total (completed)
        </p>
        <p className="mt-1 text-xl font-semibold sm:text-2xl">
          {grandTotal.toFixed(2)} EUR
        </p>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-xs font-medium uppercase text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400">
            <tr>
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2 text-right">Amount</th>
              <th className="px-3 py-2 text-right">Lines</th>
            </tr>
          </thead>
          <tbody>
            {rows?.length ? (
              rows.map((r) => (
                <tr
                  key={String(r.category)}
                  className="border-b border-zinc-100 last:border-0 dark:border-zinc-800/80"
                >
                  <td className="px-3 py-2">{r.category ?? "—"}</td>
                  <td className="px-3 py-2 text-right font-medium">
                    {Number(r.total_amount ?? 0).toFixed(2)}
                  </td>
                  <td className="px-3 py-2 text-right text-zinc-500">
                    {r.line_count ?? 0}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={3}
                  className="px-3 py-8 text-center text-sm text-zinc-500"
                >
                  No completed line items yet. Extract a receipt first.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
