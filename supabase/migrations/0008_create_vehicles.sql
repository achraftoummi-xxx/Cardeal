-- ============================================================================
--  0008 — create vehicles table for user managed vehicles / profiles
-- ============================================================================

create table if not exists public.vehicles (
  id           uuid primary key default gen_random_uuid(),
  owner_email  text,
  brand        text not null,
  model        text not null,
  year         integer default 2024,
  health_score integer default 95,
  created_at   timestamptz not null default now()
);

-- Row Level Security
alter table public.vehicles enable row level security;

drop policy if exists "vehicles_select_policy" on public.vehicles;
create policy "vehicles_select_policy"
  on public.vehicles
  for select
  to anon, authenticated
  using (true);

drop policy if exists "vehicles_insert_policy" on public.vehicles;
create policy "vehicles_insert_policy"
  on public.vehicles
  for insert
  to anon, authenticated
  with check (true);
