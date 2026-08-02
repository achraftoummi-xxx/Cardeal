-- ============================================================================
--  get_nearby_partners — geospatial RPC for the shop finder
--  --------------------------------------------------------------------------
--  Returns partners ordered strictly by distance (haversine, km) from the
--  supplied coordinates, optionally filtered by a free-text search term
--  matched against name / services_offered / establishment_type.
--  security invoker + RLS: relies on the public read policy of `partners`.
--  Called by GET /api/shops via the Supabase RPC endpoint.
-- ============================================================================

create or replace function public.get_nearby_partners(
  lat               double precision,
  lng               double precision,
  search_term       text            default null,
  max_distance_km   double precision default 50,
  max_count         integer          default 100
)
returns table (
  id                 uuid,
  name               text,
  establishment_type text,
  address            text,
  phone              text,
  website            text,
  services_offered   text,
  google_rating      numeric,
  review_count       integer,
  latitude           numeric,
  longitude          numeric,
  distance_km        double precision
)
language sql
stable
security invoker
as $$
  with nearby as (
    select
      p.id,
      p.name,
      p.establishment_type,
      p.address,
      p.phone,
      p.website,
      p.services_offered,
      p.google_rating,
      p.review_count,
      p.latitude,
      p.longitude,
      (
        6371 * 2 * asin(
          least(1.0, sqrt(
            power(sin(radians(p.latitude - lat) / 2), 2) +
            cos(radians(lat)) * cos(radians(p.latitude)) *
            power(sin(radians(p.longitude - lng) / 2), 2)
          ))
        )
      ) as distance_km
    from public.partners p
    where p.latitude is not null
      and p.longitude is not null
      and (
        search_term is null
        or search_term = ''
        or p.name ilike '%' || search_term || '%'
        or p.services_offered ilike '%' || search_term || '%'
        or p.establishment_type ilike '%' || search_term || '%'
      )
  )
  select *
  from nearby
  where distance_km <= max_distance_km
  order by distance_km asc
  limit max_count;
$$;

-- Public + authenticated callers (RLS governs row visibility)
grant execute on function public.get_nearby_partners(
  double precision, double precision, text, double precision, integer
) to anon, authenticated;
