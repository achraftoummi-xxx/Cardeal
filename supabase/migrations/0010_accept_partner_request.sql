-- Atomic admin workflow for accepting a partnership request.
alter table public.profiles
  add column if not exists category text;

create or replace function public.accept_partner_request(p_request_id uuid)
returns public.partner_requests
language plpgsql
security definer
set search_path = public
as $$
declare
  v_request public.partner_requests;
  v_partner_id uuid;
  v_user_id uuid;
  v_email text := lower(coalesce(auth.jwt() ->> 'email', ''));
begin
  if v_email not in ('mokhtari.achref06@gmail.com', 'toumiachref21@gmail.com')
     and not exists (
       select 1
       from public.profiles
       where lower(email) = v_email
         and role = 'admin'
     ) then
    raise exception 'Only administrators can accept partnership requests';
  end if;

  select * into v_request
  from public.partner_requests
  where id = p_request_id
  for update;

  if not found then
    raise exception 'Partnership request % was not found', p_request_id;
  end if;

  update public.partner_requests
  set status = 'accepted'
  where id = p_request_id
  returning * into v_request;

  select id into v_partner_id
  from public.partners
  where lower(email) = lower(v_request.email)
  limit 1;

  if v_partner_id is null then
    insert into public.partners (
      name,
      email,
      phone,
      city,
      establishment_type,
      services_offered
    ) values (
      v_request.company_name,
      lower(v_request.email),
      v_request.phone,
      coalesce(v_request.address, 'Tunis'),
      coalesce(v_request.category, 'Atelier de mécanique automobile'),
      array_to_string(v_request.services_offered, E'\n')
    )
    returning id into v_partner_id;
  end if;

  select id into v_user_id
  from auth.users
  where lower(email) = lower(v_request.email)
  limit 1;

  insert into public.profiles (email, full_name, role, status, category, partner_id)
  values (
    lower(v_request.email),
    split_part(v_request.email, '@', 1),
    'partner',
    'approved',
    v_request.category,
    v_partner_id
  )
  on conflict (email) do update set
    role = 'partner',
    status = 'approved',
    category = excluded.category,
    partner_id = excluded.partner_id;

  return v_request;
end;
$$;

revoke all on function public.accept_partner_request(uuid) from public;
grant execute on function public.accept_partner_request(uuid) to authenticated;
