-- Keep partnership request location data compatible with partner provisioning.
alter table public.partner_requests
  add column if not exists address text;
