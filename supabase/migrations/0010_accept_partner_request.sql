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

  -- Provision a passwordless auth account when the partner email is not yet
  -- registered, so the profiles.user_id foreign key is always satisfied.
  if v_user_id is null then
    insert into auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      is_sso_user,
      is_anonymous
    ) values (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      lower(v_request.email),
      '',
      now(),
      jsonb_build_object('provider', 'email', 'providers', jsonb_build_array('email')),
      jsonb_build_object('full_name', v_request.company_name, 'is_partner', true),
      now(),
      now(),
      false,
      false
    )
    on conflict do nothing
    returning id into v_user_id;

    -- A concurrent registration may have inserted the user before us.
    if v_user_id is null then
      select id into v_user_id
      from auth.users
      where lower(email) = lower(v_request.email)
      limit 1;
    end if;
  end if;

  if v_user_id is null then
    raise exception 'Could not resolve an auth user for partner email %', v_request.email;
  end if;

  insert into public.profiles (user_id, email, full_name, role, status, category, partner_id)
  values (
    v_user_id,
    lower(v_request.email),
    split_part(v_request.email, '@', 1),
    'partner',
    'approved',
    v_request.category,
    v_partner_id
  )
  on conflict (email) do update set
    user_id = coalesce(excluded.user_id, public.profiles.user_id),
    role = 'partner',
    status = 'approved',
    category = excluded.category,
    partner_id = excluded.partner_id;

  return v_request;
end;
$$;

revoke all on function public.accept_partner_request(uuid) from public;
grant execute on function public.accept_partner_request(uuid) to authenticated;
