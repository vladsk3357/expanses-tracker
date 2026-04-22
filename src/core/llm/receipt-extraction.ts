import { z } from "zod";

import { githubModelsChatCompletion } from "@/core/llm/github-models";

const lineItemSchema = z.object({
  label: z.string(),
  quantity: z.number().optional().nullable(),
  unit_price: z.number().optional().nullable(),
  category: z.string().optional().nullable(),
  line_total: z.number().optional().nullable(),
});

export const receiptExtractionSchema = z.object({
  merchant: z.string().optional().nullable(),
  purchased_at: z.string().optional().nullable(),
  currency: z.string().optional().nullable(),
  total: z.number().optional().nullable(),
  line_items: z.array(lineItemSchema),
  tax_hints: z.array(z.string()).optional(),
});

export type ReceiptExtraction = z.infer<typeof receiptExtractionSchema>;

/**
 * Models often return `tax_hints` as objects (e.g. `{ label, amount }`).
 * Normalize to string[] before strict Zod parsing.
 */
function coerceReceiptModelJson(data: unknown): unknown {
  if (!data || typeof data !== "object") {
    return data;
  }
  const d = data as Record<string, unknown>;
  const out = { ...d };
  if (!Array.isArray(d.tax_hints)) {
    return out;
  }
  out.tax_hints = d.tax_hints.map((entry) => {
    if (typeof entry === "string") {
      return entry;
    }
    if (entry !== null && typeof entry === "object") {
      const o = entry as Record<string, unknown>;
      const text =
        typeof o.text === "string"
          ? o.text
          : typeof o.label === "string"
            ? o.label
            : typeof o.name === "string"
              ? o.name
              : typeof o.description === "string"
                ? o.description
                : null;
      if (text) {
        return text;
      }
    }
    try {
      return JSON.stringify(entry);
    } catch {
      return String(entry);
    }
  });
  return out;
}

function parseEuropeanDate(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }
  const trimmed = value.trim();
  const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(trimmed);
  if (!m) {
    return null;
  }
  const day = Number(m[1]);
  const month = Number(m[2]);
  const year = Number(m[3]);
  const utc = Date.UTC(year, month - 1, day);
  const d = new Date(utc);
  if (
    Number.isNaN(d.getTime()) ||
    d.getUTCDate() !== day ||
    d.getUTCMonth() !== month - 1
  ) {
    return null;
  }
  return d.toISOString();
}

export function normalizeExtraction(raw: ReceiptExtraction): ReceiptExtraction {
  const line_items = raw.line_items.map((item) => {
    const qty = item.quantity ?? 1;
    const unit = item.unit_price ?? null;
    const lineTotal =
      item.line_total ??
      (unit != null ? Math.round(qty * unit * 100) / 100 : null);
    return {
      ...item,
      quantity: qty,
      line_total: lineTotal,
    };
  });
  return {
    ...raw,
    currency: raw.currency ?? "EUR",
    line_items,
  };
}

export async function extractReceiptFromImage(options: {
  base64: string;
  mimeType: string;
}): Promise<ReceiptExtraction> {
  const model =
    process.env.GITHUB_MODELS_MODEL?.trim() ?? "openai/gpt-4o-mini";

  const system = `You are a receipt OCR assistant. Read the receipt image and return ONE JSON object only (no markdown).
Receipts may be in Ukrainian, English, or other languages; read Cyrillic and Latin text accurately.
Use European conventions when applicable: dates may be DD/MM/YYYY; tax labels may include VAT/IVA/ПДВ.
Include line_items for each product row with label, quantity, unit_price, category (guess if missing), line_total.
Set merchant, total, currency (default EUR), purchased_at as DD/MM/YYYY string if visible, and tax_hints as an array of short plain-text strings (not objects) for notable tax lines.
If text is unreadable, return line_items as [] and total null.`;

  const dataUrl = `data:${options.mimeType};base64,${options.base64}`;

  const content = await githubModelsChatCompletion({
    model,
    responseFormat: { type: "json_object" },
    maxTokens: 4096,
    messages: [
      { role: "system", content: system },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Extract structured receipt data as JSON matching the described shape.",
          },
          { type: "image_url", image_url: { url: dataUrl } },
        ],
      },
    ],
  });

  let parsed: unknown;
  try {
    parsed = JSON.parse(content) as unknown;
  } catch {
    throw new Error("Model returned non-JSON content.");
  }

  const extraction = receiptExtractionSchema.parse(coerceReceiptModelJson(parsed));
  return normalizeExtraction(extraction);
}

export function extractionPurchasedAtIso(
  extraction: ReceiptExtraction,
): string | null {
  return parseEuropeanDate(extraction.purchased_at ?? undefined);
}
