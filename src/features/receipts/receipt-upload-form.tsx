"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { uploadReceiptAction } from "@/features/receipts/receipts-actions";

export function ReceiptUploadForm() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [optimisticNote, setOptimisticNote] = useState(false);

  async function onFileChange() {
    const input = inputRef.current;
    const file = input?.files?.[0];
    if (!file) {
      return;
    }

    setError(null);
    setPending(true);
    setOptimisticNote(true);

    try {
      const formData = new FormData();
      formData.set("file", file);
      await uploadReceiptAction(formData);
      if (input) {
        input.value = "";
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setPending(false);
      setOptimisticNote(false);
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium">Upload receipt</p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Camera or gallery — JPEG, PNG, WebP, or HEIC, up to 10MB.
        </p>
      </div>
      <label className="inline-flex min-h-11 w-full cursor-pointer items-center justify-center rounded-full bg-foreground px-4 text-sm font-medium text-background hover:bg-zinc-800 dark:hover:bg-zinc-200 sm:w-auto">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="sr-only"
          disabled={pending}
          onChange={() => void onFileChange()}
        />
        {pending ? "Uploading…" : "Take photo or choose file"}
      </label>
      {optimisticNote ? (
        <p className="text-xs text-zinc-500">Saving your receipt…</p>
      ) : null}
      {error ? (
        <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
      ) : null}
    </div>
  );
}
