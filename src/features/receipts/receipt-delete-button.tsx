"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import type { Dictionary } from "@/core/i18n/messages";
import { deleteReceiptAction } from "@/features/receipts/receipts-actions";

export function ReceiptDeleteButton({
  receiptId,
  r,
}: {
  receiptId: string;
  r: Dictionary["receipts"];
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setError(null);
    setPending(true);
    try {
      await deleteReceiptAction(receiptId);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : r.deleteFailed);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex w-full flex-col items-stretch gap-1 md:w-auto md:items-end">
      <button
        type="button"
        disabled={pending}
        onClick={() => void run()}
        className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-zinc-300 bg-transparent px-4 text-sm font-medium text-zinc-700 hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800 md:w-auto md:px-3 md:text-xs"
      >
        {pending ? r.deleting : r.deleteUpload}
      </button>
      {error ? (
        <span className="max-w-[12rem] text-right text-xs text-red-600 dark:text-red-400">
          {error}
        </span>
      ) : null}
    </div>
  );
}
