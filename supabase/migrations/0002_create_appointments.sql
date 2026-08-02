-- ============================================================================
--  appointments — booking requests created from the partner "Take
--  Appointment" flow. Public users may INSERT; reads are limited to
--  authenticated users (full admin access via the dashboard/service role).
-- ============================================================================

create table if not exists public.appointments (
  id                uuid primary key default gen_random_uuid(),
  partner_id        uuid references public.partners (id) on delete cascade,
  partner_name      text,
  full_name         text not null,
  phone             text not null,
  appointment_date  date not null,
  appointment_time  text not null,
  notes             text,
  status            text not null default 'pending',
  created_at        timestamptz not null default now()
);

create index if not exists appointments_partner_idx on public.appointments (partner_id);
create index if not exists appointments_date_idx on public.appointments (appointment_date);

alter table public.appointments enable row level security;

drop policy if exists "appointments_insert_public" on public.appointments;
create policy "appointments_insert_public"
  on public.appointments
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "appointments_select_authenticated" on public.appointments;
create policy "appointments_select_authenticated"
  on public.appointments
  for select
  to authenticated
  using (true);
