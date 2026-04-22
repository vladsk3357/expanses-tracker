-- Receipt lifecycle for uploads and LLM extraction
create type public.receipt_status as enum (
  'pending',
  'processing',
  'complete',
  'failed'
);

create table public.receipts (
  id uuid primary key default gen_random_uuid (),
  user_id uuid not null references auth.users (id) on delete cascade,
  storage_path text not null,
  status public.receipt_status not null default 'pending',
  merchant text,
  purchased_at timestamptz,
  currency text default 'EUR',
  total numeric(12, 2),
  raw_extraction jsonb,
  extraction_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index receipts_user_id_created_at_idx on public.receipts (user_id, created_at desc);

create table public.receipt_line_items (
  id uuid primary key default gen_random_uuid (),
  receipt_id uuid not null references public.receipts (id) on delete cascade,
  label text not null,
  quantity numeric(12, 3) default 1,
  unit_price numeric(12, 2),
  category text,
  line_total numeric(12, 2),
  created_at timestamptz not null default now()
);

create index receipt_line_items_receipt_id_idx on public.receipt_line_items (receipt_id);

-- RLS
alter table public.receipts enable row level security;
alter table public.receipt_line_items enable row level security;

create policy "receipts_select_own" on public.receipts for select using (auth.uid () = user_id);

create policy "receipts_insert_own" on public.receipts for insert
with
  check (auth.uid () = user_id);

create policy "receipts_update_own" on public.receipts for update using (auth.uid () = user_id)
with
  check (auth.uid () = user_id);

create policy "receipts_delete_own" on public.receipts for delete using (auth.uid () = user_id);

create policy "receipt_line_items_select_own" on public.receipt_line_items for select using (
  exists (
    select 1
    from public.receipts r
    where
      r.id = receipt_line_items.receipt_id
      and r.user_id = auth.uid ()
  )
);

create policy "receipt_line_items_insert_own" on public.receipt_line_items for insert
with
  check (
    exists (
      select 1
      from public.receipts r
      where
        r.id = receipt_line_items.receipt_id
        and r.user_id = auth.uid ()
    )
  );

create policy "receipt_line_items_update_own" on public.receipt_line_items for update using (
  exists (
    select 1
    from public.receipts r
    where
      r.id = receipt_line_items.receipt_id
      and r.user_id = auth.uid ()
  )
)
with
  check (
    exists (
      select 1
      from public.receipts r
      where
        r.id = receipt_line_items.receipt_id
        and r.user_id = auth.uid ()
    )
  );

create policy "receipt_line_items_delete_own" on public.receipt_line_items for delete using (
  exists (
    select 1
    from public.receipts r
    where
      r.id = receipt_line_items.receipt_id
      and r.user_id = auth.uid ()
  )
);

-- Private bucket for receipt images (path: <user_uuid>/<filename>)
insert into storage.buckets (id, name, public)
values ('receipts', 'receipts', false)
on conflict (id) do nothing;

create policy "receipts_storage_select_own"
on storage.objects for select to authenticated using (
  bucket_id = 'receipts'
  and split_part(name, '/', 1) = auth.uid ()::text
);

create policy "receipts_storage_insert_own"
on storage.objects for insert to authenticated
with
  check (
    bucket_id = 'receipts'
    and split_part(name, '/', 1) = auth.uid ()::text
  );

create policy "receipts_storage_update_own"
on storage.objects for update to authenticated using (
  bucket_id = 'receipts'
  and split_part(name, '/', 1) = auth.uid ()::text
)
with
  check (
    bucket_id = 'receipts'
    and split_part(name, '/', 1) = auth.uid ()::text
  );

create policy "receipts_storage_delete_own"
on storage.objects for delete to authenticated using (
  bucket_id = 'receipts'
  and split_part(name, '/', 1) = auth.uid ()::text
);

-- Aggregated spend by category (invoker = current user; safe under RLS on base tables)
create or replace view public.receipt_category_totals
with
  (security_invoker = true) as
select
  r.user_id,
  coalesce(li.category, 'uncategorized') as category,
  sum(coalesce(li.line_total, 0))::numeric(14, 2) as total_amount,
  count(*)::bigint as line_count
from
  public.receipts r
  join public.receipt_line_items li on li.receipt_id = r.id
where
  r.status = 'complete'
group by
  r.user_id,
  coalesce(li.category, 'uncategorized');

grant select, insert, update, delete on table public.receipts to authenticated;

grant select, insert, update, delete on table public.receipt_line_items to authenticated;

grant select on table public.receipt_category_totals to authenticated;
