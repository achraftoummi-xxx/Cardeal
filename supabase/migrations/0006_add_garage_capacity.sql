-- ============================================================================
--  0006 — garage capacity for partners
--  --------------------------------------------------------------------------
--  garage_capacity = maximum number of cars the garage can service
--  simultaneously. Drives the live spot-availability badge on partner
--  search/profile cards (capacity minus active appointments).
-- ============================================================================

alter table public.partners
  add column if not exists garage_capacity integer;

-- Seed sensible defaults for the original dataset so every existing partner
-- renders a capacity + availability badge (parts distributors get 2 bays,
-- repair shops get 4). New partners supply their own value via the form.
update public.partners
set garage_capacity = case
  when establishment_type ilike '%magasin%'
    or establishment_type ilike '%distribution%'
    or establishment_type ilike '%pieces%'
  then 2
  else 4
end
where garage_capacity is null;