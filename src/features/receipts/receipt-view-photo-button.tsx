"use client";

import { useLayoutEffect, useRef, useState } from "react";

import type { Dictionary } from "@/core/i18n/messages";

type LoadPhase = "idle" | "loading" | "ready" | "error";

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

export function ReceiptViewPhotoButton({
  receiptId,
  r,
}: {
  receiptId: string;
  r: Dictionary["receipts"];
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [imgKey, setImgKey] = useState(0);
  const [loadPhase, setLoadPhase] = useState<LoadPhase>("idle");

  useLayoutEffect(() => {
    if (loadPhase !== "loading") {
      return;
    }
    const img = imgRef.current;
    if (!img) {
      return;
    }
    // Cached (or already-finished) images often never fire `onLoad` after the handler is bound.
    // One rAF helps WebKit after redirects to the signed URL.
    function bumpIfLoaded() {
      const el = imgRef.current;
      if (el?.complete && el.naturalHeight > 0) {
        setLoadPhase("ready");
      }
    }
    bumpIfLoaded();
    const raf = requestAnimationFrame(bumpIfLoaded);
    return () => cancelAnimationFrame(raf);
  }, [imgKey, loadPhase]);

  function open() {
    setLoadPhase("loading");
    setImgKey((k) => k + 1);
    dialogRef.current?.showModal();
  }

  function close() {
    dialogRef.current?.close();
  }

  return (
    <>
      <button
        type="button"
        onClick={open}
        className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-zinc-300 bg-transparent px-4 text-sm font-medium text-zinc-700 hover:bg-zinc-100 md:w-auto md:px-3 md:text-xs dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
      >
        {r.viewPhoto}
      </button>
      <dialog
        ref={dialogRef}
        onClose={() => {
          setLoadPhase("idle");
        }}
        className="fixed inset-0 z-50 m-0 hidden h-[100dvh] max-h-none w-full max-w-none flex-col border-0 bg-transparent p-0 text-zinc-100 outline-none open:flex backdrop:bg-black/85 backdrop:backdrop-blur-sm"
        aria-labelledby={`receipt-photo-title-${receiptId}`}
      >
        <div className="flex h-[100dvh] min-h-0 w-full flex-col bg-zinc-950">
          <header
            className="flex shrink-0 items-center justify-end gap-3 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2"
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              id={`receipt-photo-title-${receiptId}`}
              className="sr-only"
            >
              {r.viewPhotoTitle}
            </h2>
            <button
              type="button"
              onClick={close}
              autoFocus
              aria-label={r.closePhoto}
              className="inline-flex h-11 min-w-11 items-center justify-center rounded-full bg-white/10 text-white ring-zinc-400 transition hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </header>

          <div
            className="relative flex min-h-0 flex-1 cursor-default flex-col items-center justify-center px-3 pb-[max(1rem,env(safe-area-inset-bottom))] pt-1 sm:px-6"
            onClick={close}
          >
            {loadPhase === "error" ? (
              <p
                className="max-w-sm text-center text-sm text-red-400"
                onClick={(e) => e.stopPropagation()}
                role="alert"
              >
                {r.viewPhotoLoadError}
              </p>
            ) : loadPhase !== "idle" ? (
              <>
                {loadPhase === "loading" ? (
                  <div
                    className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-zinc-950/40"
                    aria-hidden
                  >
                    <div className="h-56 w-40 max-w-[70vw] animate-pulse rounded-xl bg-white/[0.12] motion-reduce:animate-none sm:h-72 sm:w-52" />
                  </div>
                ) : null}
                <img
                  ref={imgRef}
                  key={imgKey}
                  src={`/api/receipts/${receiptId}/photo`}
                  alt={r.viewPhotoTitle}
                  decoding="async"
                  draggable={false}
                  className="relative z-0 max-h-[min(calc(100dvh-5.5rem),90dvh)] max-w-full touch-pan-x touch-pan-y object-contain shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_25px_50px_-12px_rgba(0,0,0,0.65)]"
                  onClick={(e) => e.stopPropagation()}
                  onLoad={(e) => {
                    if (e.currentTarget.naturalHeight > 0) {
                      setLoadPhase("ready");
                    }
                  }}
                  onError={() => setLoadPhase("error")}
                />
              </>
            ) : null}
          </div>
        </div>
      </dialog>
    </>
  );
}
