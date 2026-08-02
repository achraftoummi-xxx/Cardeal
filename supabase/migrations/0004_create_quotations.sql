-- ============================================================================
--  quotations — quotation/note requests created from the partner
--  "Request A note" (Request Quotation) flow. Mirrors `appointments`:
--  public users may INSERT; reads are limited to authenticated users
--  (full admin access via the dashboard/service role).
-- ============================================================================

create table if not exists public.quotations (
  id                uuid primary key default gen_random_uuid(),
  partner_id        uuid references public.partners (id) on delete cascade,
  partner_name      text,
  full_name         text not null,
  phone             text not null,
  notes             text,
  status            text not null default 'pending',
  created_at        timestamptz not null default now()
);

create index if not exists quotations_partner_idx on public.quotations (partner_id);

alter table public.quotations enable row level security;

drop policy if exists "quotations_insert_public" on public.quotations;
create policy "quotations_insert_public"
  on public.quotations
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "quotations_select_authenticated" on public.quotations;
create policy "quotations_select_authenticated"
  on public.quotations
  for select
  to authenticated
  using (true);
