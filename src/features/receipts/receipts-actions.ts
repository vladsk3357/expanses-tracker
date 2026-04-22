"use server";

import { revalidatePath } from "next/cache";

import type { Json } from "@/database.types";
import { getLocale } from "@/core/i18n/locale";
import { getMessages } from "@/core/i18n/messages";
import { createSupabaseServerClient } from "@/core/supabase/server";
import {
  extractionPurchasedAtIso,
  extractReceiptFromImage,
} from "@/core/llm/receipt-extraction";

const allowedMime = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
]);

const maxBytes = 10 * 1024 * 1024;

export async function uploadReceiptAction(formData: FormData) {
  const locale = await getLocale();
  const a = getMessages(locale).actions;

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    throw new Error(a.supabaseNotConfigured);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error(a.mustBeSignedIn);
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    throw new Error(a.chooseImage);
  }

  if (file.size > maxBytes) {
    throw new Error(a.fileTooLarge);
  }

  const mime = file.type || "image/jpeg";
  if (!allowedMime.has(mime)) {
    throw new Error(a.invalidMime);
  }

  const extFromName = file.name.includes(".")
    ? file.name.split(".").pop()?.toLowerCase()
    : null;
  const ext =
    extFromName && /^[a-z0-9]{1,8}$/.test(extFromName) ? extFromName : "jpg";

  const id = crypto.randomUUID();
  const path = `${user.id}/${id}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from("receipts")
    .upload(path, buffer, {
      contentType: mime,
      upsert: false,
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data: row, error: insertError } = await supabase
    .from("receipts")
    .insert({
      user_id: user.id,
      storage_path: path,
      status: "pending",
    })
    .select("id")
    .single();

  if (insertError || !row) {
    await supabase.storage.from("receipts").remove([path]);
    throw new Error(insertError?.message ?? a.couldNotSaveReceipt);
  }

  revalidatePath("/receipts");
  return { id: row.id };
}

export async function processReceiptAction(receiptId: string) {
  const locale = await getLocale();
  const a = getMessages(locale).actions;

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    throw new Error(a.supabaseNotConfigured);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error(a.mustBeSignedIn);
  }

  const { data: receipt, error: fetchError } = await supabase
    .from("receipts")
    .select("id, user_id, storage_path, status")
    .eq("id", receiptId)
    .single();

  if (fetchError || !receipt || receipt.user_id !== user.id) {
    throw new Error(a.receiptNotFound);
  }

  if (receipt.status !== "pending" && receipt.status !== "failed") {
    throw new Error(a.receiptNotPending);
  }

  await supabase
    .from("receipts")
    .update({ status: "processing", extraction_error: null })
    .eq("id", receipt.id);

  revalidatePath("/receipts");

  try {
    const { data: blob, error: dlError } = await supabase.storage
      .from("receipts")
      .download(receipt.storage_path);

    if (dlError || !blob) {
      throw new Error(dlError?.message ?? a.couldNotReadImage);
    }

    const bytes = Buffer.from(await blob.arrayBuffer());
    const pathLower = receipt.storage_path.toLowerCase();
    const mimeFromPath = pathLower.endsWith(".png")
      ? "image/png"
      : pathLower.endsWith(".webp")
        ? "image/webp"
        : pathLower.endsWith(".heic") || pathLower.endsWith(".heif")
          ? "image/heic"
          : pathLower.endsWith(".jpg") || pathLower.endsWith(".jpeg")
            ? "image/jpeg"
            : null;
    const mime = blob.type || mimeFromPath || "image/jpeg";
    const base64 = bytes.toString("base64");

    const extraction = await extractReceiptFromImage({
      base64,
      mimeType: mime,
    });

    const purchasedAt = extractionPurchasedAtIso(extraction);
    const total =
      extraction.total ??
      extraction.line_items.reduce((sum, li) => sum + (li.line_total ?? 0), 0);

    await supabase.from("receipt_line_items").delete().eq("receipt_id", receipt.id);

    if (extraction.line_items.length > 0) {
      const rows = extraction.line_items.map((li) => ({
        receipt_id: receipt.id,
        label: li.label,
        quantity: li.quantity ?? 1,
        unit_price: li.unit_price,
        category: li.category,
        line_total: li.line_total,
      }));

      const { error: liError } = await supabase
        .from("receipt_line_items")
        .insert(rows);

      if (liError) {
        throw new Error(liError.message);
      }
    }

    const { error: upError } = await supabase
      .from("receipts")
      .update({
        status: "complete",
        merchant: extraction.merchant,
        purchased_at: purchasedAt,
        currency: extraction.currency ?? "EUR",
        total,
        raw_extraction: extraction as unknown as Json,
        extraction_error: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", receipt.id);

    if (upError) {
      throw new Error(upError.message);
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : a.extractionFailed;
    await supabase
      .from("receipts")
      .update({
        status: "failed",
        extraction_error: message,
        updated_at: new Date().toISOString(),
      })
      .eq("id", receipt.id);
    revalidatePath("/receipts");
    throw e;
  }

  revalidatePath("/receipts");
  revalidatePath("/statistics");
}
