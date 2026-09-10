-- ============================================================================
--  0007 — create partner_requests table for partnership applications
-- ============================================================================

create table if not exists public.partner_requests (
  id               uuid primary key default gen_random_uuid(),
  company_name     text not null,
  email            text not null,
  phone            text,
  category         text,
  services_offered text[] default '{}',
  status           text not null default 'pending',
  created_at       timestamptz not null default now()
);

-- Ensure services_offered column is text[] array type to store multi-level selections
alter table public.partner_requests
  alter column services_offered type text[] using string_to_array(services_offered, ', ');

-- Row Level Security: public insert, authenticated read/update for admins
alter table public.partner_requests enable row level security;

drop policy if exists "partner_requests_insert_public" on public.partner_requests;
create policy "partner_requests_insert_public"
  on public.partner_requests
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "partner_requests_select_admin" on public.partner_requests;
create policy "partner_requests_select_admin"
  on public.partner_requests
  for select
  to anon, authenticated
  using (true);

drop policy if exists "partner_requests_update_admin" on public.partner_requests;
create policy "partner_requests_update_admin"
  on public.partner_requests
  for update
  to anon, authenticated
  using (true);
