-- ============================================================================
--  partners — table definition + seed data (automotive repair shops, Tunisia)
--  Source: scraped Google Maps dataset (JSON), cleaned & normalized.
--  Cleansing rules applied:
--    * Header/placeholder row and rows without a name or coordinates dropped.
--    * Multi-line fields (name, address, type) collapsed to a single line.
--    * Phone numbers normalized to digits only (e.g. "24 505 823" -> "24505823").
--    * Ratings normalized to decimal dot ("4,9" -> 4.9).
--    * Coordinates normalized to decimal degrees; DMS (36°48'46.2"N...) converted.
--    * google_map_coords always stored as "lat, lng" text; latitude/longitude
--      columns mirror the shape returned by GET /api/shops for the map.
--  Run: paste into Supabase SQL Editor, or psql $DATABASE_URL -f 0001_create_partners.sql
-- ============================================================================

-- ----------------------------------------------------------------------------
--  Table definition
-- ----------------------------------------------------------------------------
create table if not exists public.partners (
  id                  uuid primary key default gen_random_uuid(),
  city                text,
  zip_code            text,
  name                text not null,
  establishment_type  text,
  address             text,
  phone               text,
  email               text,
  website             text,
  google_map_coords   text,
  latitude            numeric(10, 7),
  longitude           numeric(10, 7),
  facebook_url        text,
  instagram_url       text,
  google_rating       numeric(3, 1),
  review_count        integer,
  opening_hours       text,
  services_offered    text,
  additional_info     text,
  created_at          timestamptz not null default now()
);

-- Indexes used by the shop finder / map queries
create index if not exists partners_city_idx on public.partners (city);
create index if not exists partners_coords_idx on public.partners (latitude, longitude);

-- Row Level Security: public read access, writes via service role only
alter table public.partners enable row level security;

drop policy if exists "partners_select_public" on public.partners;
create policy "partners_select_public"
  on public.partners
  for select
  to anon, authenticated
  using (true);

-- ----------------------------------------------------------------------------
--  Seed data (12 partners)
-- ----------------------------------------------------------------------------
insert into public.partners
  (city, zip_code, name, establishment_type, address, phone, email, website, google_map_coords, latitude, longitude, facebook_url, instagram_url, google_rating, review_count, opening_hours, services_offered, additional_info)
values
  (
    'Tunis',
    '1002',
    'El japouni auto service',
    'Atelier de mécanique automobile',
    'Tunis، 37 Rue du Liban, 1002, Tunis, Tunisia',
    '24505823',
    'chagoueybaha@gmail.com',
    NULL,
    '36.81283333, 10.17763889',
    '36.81283333',
    '10.17763889',
    'https://www.facebook.com/eljapouniauto/?locale=fr_FR',
    'https://www.instagram.com/reel/DNWQ8RhCEmq/',
    '4.9',
    '64',
    'Ouvert 24/24',
    '• Réparation et dépannage
voitures toutes marques
• Climatisation • Diagnostic
• Réparation mécanique • Freinage
• Suspension • Vidange',
    NULL
  ),
  (
    'Tunis',
    '1005',
    'GRM Garage Rezgui Mohamed',
    'Service de réparation',
    '9 Rue farj Gaàloul, Tunis 1005',
    '23740708',
    'grm.automobiles@gmail.com',
    NULL,
    '36.81880928150158, 10.160199369076784',
    '36.81880928150158',
    '10.160199369076784',
    'https://www.facebook.com/garage.rezgui.mohamed',
    NULL,
    '4.9',
    '79',
    '08:00–18:00',
    '• Diagnostics
• Réparation de véhicules
• Vente et achat de véhicules
• Installation
• Réparation de congélateurs
• Service de réparation automobiles',
    NULL
  ),
  (
    'Beni Khiar',
    NULL,
    'EXTREM GARAGE 4x4',
    'Mécanicien',
    NULL,
    '54621556',
    NULL,
    NULL,
    '36.490281408266874, 10.793663235216975',
    '36.490281408266874',
    '10.793663235216975',
    NULL,
    NULL,
    '4.3',
    '3',
    'Ouvert 24/24',
    NULL,
    NULL
  ),
  (
    'La Goulette',
    '2060',
    'Garage de confiance',
    'Mécanicien',
    'Av. du Parc R8R3+8J La Goulette',
    '98675390',
    NULL,
    NULL,
    '36.835845341233245, 10.3134547812433',
    '36.835845341233245',
    '10.3134547812433',
    NULL,
    NULL,
    '5',
    '5',
    'Ouvert 24/24',
    NULL,
    NULL
  ),
  (
    'Enfidha',
    '4030',
    'Garage électricité automobile Ghazi',
    'Garage automobile',
    '49P9+5W9, Autoroute A1, Enfidha',
    '96238501',
    NULL,
    'https://porte-de-garage.tn/',
    '36.136423373681026, 10.369948811371248',
    '36.136423373681026',
    '10.369948811371248',
    NULL,
    NULL,
    '4.8',
    '12',
    'Ouvert 24/24',
    '• Pneus
• Diagnostic de moteurs automobiles
• Batterie
• Dépannage et réparation de freins
• Systèmes électriques
• Réparation électrique
• Réparation de boîtiers de traction',
    NULL
  ),
  (
    'Tunis',
    NULL,
    'Garage ala mécanique automobile',
    'Atelier de réparation automobile',
    'CF8V+M84, C28',
    '21817941',
    NULL,
    NULL,
    '36.41667367246862, 10.493302588012812',
    '36.41667367246862',
    '10.493302588012812',
    NULL,
    NULL,
    '5',
    '1',
    NULL,
    NULL,
    NULL
  ),
  (
    'Mnihla',
    '2094',
    'El Mecano Garage',
    'Garage automobile',
    'Tunis, Mnihla',
    '52351490',
    'cs-elmecano@outlook.com',
    'https://elmecano.co/',
    '36.8871276150499, 10.108782822716389',
    '36.8871276150499',
    '10.108782822716389',
    'https://www.facebook.com/ellmecano',
    'https://www.instagram.com/ellmecano/',
    '4.7',
    '363',
    '• Lundi - Vendredi :
8h30 - 15h00
• Samedi :
8h30 - 12h00
• Dimanche : Fermé',
    '• Diagnostic de moteurs automobiles
• Freins • Pneus • Vidange
• Réparation de directions et suspensions
• Reparation mecanique et electrique
• Reprogrammation ECU',
    NULL
  ),
  (
    'Le Bardo',
    '2000',
    'Das Auto Repair',
    'Garage automobile',
    'Shell à Droite, Le Bardo (400 mètres après Kiosque, 2000)',
    '98711019',
    NULL,
    NULL,
    '36.8183746717687, 10.12649249606244',
    '36.8183746717687',
    '10.12649249606244',
    NULL,
    NULL,
    '4.7',
    '61',
    '• Lundi - Vendredi :
8h00 - 17h30
• Samedi :
8h00 - 15h00
• Dimanche : Fermé',
    '• Réparation de directions et suspensions
• Pneus • Vidange • Freins
• Diagnostic de moteurs automobiles
• Charge climatiseur • Diagnostic
• Mécanique',
    NULL
  ),
  (
    'Mnihla',
    '2094',
    'LE GRAND GARAGE MNIHLA',
    'Garage automobile',
    'R130, Cebalat Ben Ammar، Route De Bizerte، KM7 2094',
    '58203040',
    NULL,
    NULL,
    '36.87384633815297, 10.115376896065259',
    '36.87384633815297',
    '10.115376896065259',
    NULL,
    NULL,
    '4',
    '59',
    '• Lundi - Vendredi :
8h00 - 17h00
• Samedi :
8h00 - 13h30
• Dimanche : Fermé',
    '• Réparation de directions et suspensions
• Réparation de boîtiers de traction
• Pneus • Réparation électrique
• Réparation de carrosseries
• Batterie • Vidange • Climatisation
• Remplacement de filtres d''air pour habitacle
• Diagnostic de moteurs automobiles
• Systèmes électriques
• Dépannage et réparation de freins
• Alignement des roues • Tuyère
• Freins • Transmissions
• Vente Voitures HYUNDAI',
    NULL
  ),
  (
    'Tunis',
    NULL,
    'MTS AUTO CENTER, VOLKSWAGEN',
    'Atelier de réparation automobile',
    'R6W3+33 Tunis',
    '29666213',
    NULL,
    'http://www.mtsautocenter.tn/',
    '36.84535581816601, 10.202542707706622',
    '36.84535581816601',
    '10.202542707706622',
    NULL,
    NULL,
    '4.2',
    '172',
    '• Lundi - Vendredi :
8h00 - 17h00
• Samedi :
8h00 - 13h00
• Dimanche : Fermé',
    NULL,
    NULL
  ),
  (
    'Megrine',
    '1009',
    'AD Tunisie : Distribution de pièces auto et poids lourds et équipements de garage en Tunisie.',
    'Magasin de pièces de rechange automobiles',
    'Route Z4 Saint Gobain Tunis,',
    '70603133',
    NULL,
    'https://www.ad-tunisie.com/',
    '36.77712013327971, 10.20785911844667',
    '36.77712013327971',
    '10.20785911844667',
    'https://www.facebook.com/rechangetunisie/?locale=fr_FR',
    NULL,
    '4.2',
    '34',
    '• Lundi - Vendredi :
8h00 - 17h00
• Samedi et Dimanche :
Fermé',
    NULL,
    'Possibilté de livraison'
  ),
  (
    'Mnihla',
    NULL,
    'Garage l''Expert',
    'Atelier de réparation automobile',
    'V4F8+C6W, R R 31, Cebalat Ben Ammar',
    '27071442',
    'lexpert.ch@gmail.com',
    NULL,
    '36.87395787256848, 10.114858009558143',
    '36.87395787256848',
    '10.114858009558143',
    'https://www.facebook.com/p/Garage-lexpert-61566876997862/',
    'https://www.instagram.com/garage_lexpert/',
    '4.8',
    '45',
    '• Lundi - Vendredi :
8h30 - 16h30
• Samedi :
8h30 - 13h30
• Dimanche : Fermé',
    '• Batterie • Freins • Vidange
• Diagnostic de moteurs automobiles
• Remplacement de filtres d''air pour habitacle
• Réparation de directions et suspensions
• Systèmes électriques • Transmissions
• Contrôle de sécurité des véhicules
• Contrôle des émissions automobiles
• Contrôle technique • Entretien automobile
• Installation d''essuie-glaces
• Réglage de moteurs automobiles
• Remplacement de circuits d''échappement automobiles
• Remplacement de directions et de suspensions
• Remplacement de freins de véhicule
• Remplacement de transmissions
• Réparation de circuits d''échappement de véhicules
• Réparation de freins automobiles
• Réparation de fuites d''eau pour véhicules
• Réparation de moteurs •Réparation électrique
• Services généraux de réparation et de maintenance
• Test suspension • Nettoyage filtre à particules
• Nettoyage catalyseur',
    NULL
  ),
  (
    'Tunis',
    '2036',
    'AutoGo X20',
    'Station Pneumatique & Garage',
    'Avenue X20, Tunis, Tunisia',
    '71000000',
    NULL,
    NULL,
    '36.847336, 10.107711',
    '36.847336',
    '10.107711',
    NULL,
    NULL,
    '4.8',
    '28',
    '• Lundi - Samedi :
8h00 - 18h00
• Dimanche : Fermé',
    '• Station Pneumatique
• Vente et montage de Pneus & Batteries
• Equilibrage
• Parallélisme
• Charge climatiseur
• Diagnostic complet',
    NULL
  ),
  (
    'Nabeul',
    '8000',
    'Trabelsi Pneu',
    'Station Pneumatique & Vente de Pneus',
    'Avenue Habib Bourguiba, Nabeul, Tunisia',
    '72000000',
    NULL,
    NULL,
    '36.46863694716793, 10.762677515342881',
    '36.46863694716793',
    '10.762677515342881',
    NULL,
    NULL,
    '4.6',
    '19',
    '• Lundi - Samedi :
8h00 - 19h00
• Dimanche : Fermé',
    '• Sale tires
• Vente et montage de Pneus
• Equilibrage
• Réparation de pneus',
    NULL
  ),
  (
    'Tunis',
    '1001',
    'SMART auto tunisie',
    'Magasin d''accessoires et pièces automobiles',
    'Tunis, Tunisia',
    '71111111',
    NULL,
    NULL,
    '36.800205, 10.185776',
    '36.800205',
    '10.185776',
    NULL,
    NULL,
    '4.7',
    '31',
    '• Lundi - Samedi :
8h30 - 18h30
• Dimanche : Fermé',
    '• Vente de l''accessoires pour les véhicules automobiles
• Accessoires intérieurs et extérieurs
• Équipements et gadgets auto',
    NULL
  );
