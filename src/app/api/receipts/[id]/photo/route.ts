import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/core/supabase/server";

const uuidRe =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  if (!uuidRe.test(id)) {
    return new NextResponse(null, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return new NextResponse(null, { status: 503 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return new NextResponse(null, { status: 401 });
  }

  const { data: receipt, error } = await supabase
    .from("receipts")
    .select("storage_path, user_id")
    .eq("id", id)
    .single();

  if (error || !receipt || receipt.user_id !== user.id) {
    return new NextResponse(null, { status: 404 });
  }

  const { data: signed, error: signError } = await supabase.storage
    .from("receipts")
    .createSignedUrl(receipt.storage_path, 120);

  if (signError || !signed?.signedUrl) {
    return new NextResponse(null, { status: 502 });
  }

  return NextResponse.redirect(signed.signedUrl);
}
