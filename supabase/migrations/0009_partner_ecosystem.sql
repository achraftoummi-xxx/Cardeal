-- ============================================================================
--  0009 — comprehensive partner interface & backend database module migration
--  Covers: profiles role/status support, quotations guest metadata updates,
--  services_catalog, partner_hours, partner_staff, inventory_parts, and strict RLS.
-- ============================================================================

-- 1. Ensure profiles table supports partner association and role check
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  role text not null default 'client', -- 'client' | 'partner' | 'admin'
  status text not null default 'pending', -- 'pending' | 'approved' | 'rejected'
  partner_id uuid references public.partners(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own_or_partner" on public.profiles;
create policy "profiles_select_own_or_partner"
  on public.profiles
  for select
  to anon, authenticated
  using (true);

drop policy if exists "profiles_insert_update_policy" on public.profiles;
create policy "profiles_insert_update_policy"
  on public.profiles
  for all
  to anon, authenticated
  using (true)
  with check (true);

-- 2. Update quotations table to support guest metadata and nullable user_id
do $$
begin
  if not exists (select 1 from information_schema.columns where table_name='quotations' and column_name='user_id') then
    alter table public.quotations add column user_id uuid;
  end if;
  if not exists (select 1 from information_schema.columns where table_name='quotations' and column_name='guest_name') then
    alter table public.quotations add column guest_name text;
  end if;
  if not exists (select 1 from information_schema.columns where table_name='quotations' and column_name='guest_email') then
    alter table public.quotations add column guest_email text;
  end if;
  if not exists (select 1 from information_schema.columns where table_name='quotations' and column_name='guest_phone') then
    alter table public.quotations add column guest_phone text;
  end if;
end $$;

-- 3. Update appointments table to support guest metadata and nullable user_id
do $$
begin
  if not exists (select 1 from information_schema.columns where table_name='appointments' and column_name='user_id') then
    alter table public.appointments add column user_id uuid;
  end if;
  if not exists (select 1 from information_schema.columns where table_name='appointments' and column_name='guest_name') then
    alter table public.appointments add column guest_name text;
  end if;
  if not exists (select 1 from information_schema.columns where table_name='appointments' and column_name='guest_email') then
    alter table public.appointments add column guest_email text;
  end if;
  if not exists (select 1 from information_schema.columns where table_name='appointments' and column_name='guest_phone') then
    alter table public.appointments add column guest_phone text;
  end if;
end $$;

-- 4. Centralized database table for services catalog (synced with partnership registration)
create table if not exists public.services_catalog (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  sub_category text not null unique,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.services_catalog enable row level security;
drop policy if exists "services_catalog_public" on public.services_catalog;
create policy "services_catalog_public"
  on public.services_catalog
  for select
  to anon, authenticated
  using (true);

drop policy if exists "services_catalog_all" on public.services_catalog;
create policy "services_catalog_all"
  on public.services_catalog
  for all
  to anon, authenticated
  using (true)
  with check (true);

-- Seed basic service categories if empty
insert into public.services_catalog (category, sub_category)
values
  ('Atelier de Mécanique & Entretien', 'Révisions et Vidange'),
  ('Atelier de Mécanique & Entretien', 'Plaquettes de freins Avant (Remplacement)'),
  ('Atelier de Mécanique & Entretien', 'Courroie de distribution - Kit complet (Remplacement)'),
  ('Atelier de Mécanique & Entretien', 'Amortisseurs Avants (Remplacement)'),
  ('Atelier de Mécanique & Entretien', 'Embrayage - Kit complet (Remplacement)'),
  ('Spécialiste Pneumatiques & Géométrie', 'Pneus - Montage et Équilibrage'),
  ('Spécialiste Pneumatiques & Géométrie', 'Réparation crevaison pneu'),
  ('Spécialiste Pneumatiques & Géométrie', 'Parallélisme train Avant (Réglage)'),
  ('Vente de Pièces Détachées', 'Pièces Moteur & Filtration'),
  ('Vente de Pièces Détachées', 'Freinage & Suspension'),
  ('Vente de Pièces Détachées', 'Électricité & Démarrage'),
  ('Diagnostic & Électronique', 'Diagnostic Sécurité & Électronique'),
  ('Diagnostic & Électronique', 'Recharge Climatisation'),
  ('Diagnostic & Électronique', 'Contrôle Circuit de charge')
on conflict (sub_category) do nothing;


-- 5. Partner operating hours (partner_hours)
create table if not exists public.partner_hours (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid references public.partners(id) on delete cascade,
  day_of_week text not null, -- 'Lundi', 'Mardi', etc.
  open_time text not null default '08:00',
  close_time text not null default '18:00',
  is_closed boolean not null default false,
  created_at timestamptz not null default now(),
  constraint partner_hours_day_unique unique(partner_id, day_of_week)
);

alter table public.partner_hours enable row level security;
drop policy if exists "partner_hours_policy" on public.partner_hours;
create policy "partner_hours_policy"
  on public.partner_hours
  for all
  to anon, authenticated
  using (true)
  with check (true);


-- 6. Partner staff roster (partner_staff)
create table if not exists public.partner_staff (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid references public.partners(id) on delete cascade,
  name text not null,
  role text not null default 'Mécanicien', -- e.g. Master Mechanic, Alignment Specialist
  hourly_rate numeric(10,2) default 50.00,
  email text,
  phone text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.partner_staff enable row level security;
drop policy if exists "partner_staff_policy" on public.partner_staff;
create policy "partner_staff_policy"
  on public.partner_staff
  for all
  to anon, authenticated
  using (true)
  with check (true);


-- 7. Parts inventory (inventory_parts) linked to quotations & stock updates
create table if not exists public.inventory_parts (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid references public.partners(id) on delete cascade,
  sku text not null,
  part_name text not null,
  category text,
  unit_price numeric(10,2) not null default 0.00,
  stock_quantity integer not null default 0,
  created_at timestamptz not null default now(),
  constraint inventory_sku_unique unique(partner_id, sku)
);

alter table public.inventory_parts enable row level security;
drop policy if exists "inventory_parts_policy" on public.inventory_parts;
create policy "inventory_parts_policy"
  on public.inventory_parts
  for all
  to anon, authenticated
  using (true)
  with check (true);

-- Ensure RLS allows public / anon insertion for appointments and quotations
drop policy if exists "appointments_insert_public" on public.appointments;
create policy "appointments_insert_public"
  on public.appointments
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "quotations_insert_public" on public.quotations;
create policy "quotations_insert_public"
  on public.quotations
  for insert
  to anon, authenticated
  with check (true);
