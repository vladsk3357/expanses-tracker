"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import type { Dictionary } from "@/core/i18n/messages";
import { processReceiptAction } from "@/features/receipts/receipts-actions";

export function ReceiptProcessButton({
  receiptId,
  disabled,
  r,
}: {
  receiptId: string;
  disabled: boolean;
  r: Dictionary["receipts"];
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setError(null);
    setPending(true);
    try {
      await processReceiptAction(receiptId);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : r.extractionFailed);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex w-full flex-col items-stretch gap-1 md:w-auto md:items-end">
      <button
        type="button"
        disabled={disabled || pending}
        onClick={() => void run()}
        className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-foreground px-4 text-sm font-medium text-background disabled:opacity-50 md:w-auto md:px-3 md:text-xs"
      >
        {pending ? r.extracting : r.extract}
      </button>
      {error ? (
        <span className="max-w-[12rem] text-right text-xs text-red-600 dark:text-red-400">
          {error}
        </span>
      ) : null}
    </div>
  );
}
