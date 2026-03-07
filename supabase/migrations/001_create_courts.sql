-- ============================================================
-- CaseMap.live — Migration 001: courts table
-- Run this in your Supabase project's SQL Editor.
-- ============================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- Courts table
create table if not exists courts (
  id              uuid primary key default gen_random_uuid(),
  cl_court_id     text not null unique,
  name            text not null,
  short_name      text not null,
  court_type      text not null check (court_type in (
                    'federal_district', 'federal_appellate', 'federal_bankruptcy',
                    'state_appellate', 'state_trial', 'state_housing',
                    'state_family', 'state_surrogate', 'state_claims'
                  )),
  jurisdiction    text not null default 'NY',
  latitude        float not null,
  longitude       float not null,
  altitude_flyto  float not null default 300,
  address         text not null,
  borough         text,
  marker_color    text not null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger courts_updated_at
  before update on courts
  for each row execute function update_updated_at();

-- Index for fast lookup by CourtListener ID
create index if not exists courts_cl_court_id_idx on courts (cl_court_id);

-- Index for geo queries (future)
create index if not exists courts_location_idx on courts (latitude, longitude);

-- ============================================================
-- SEED DATA — all NY courts (~45 entries)
-- ============================================================

insert into courts (cl_court_id, name, short_name, court_type, jurisdiction, latitude, longitude, altitude_flyto, address, borough, marker_color) values

-- ── FEDERAL DISTRICT COURTS ──────────────────────────────────
('nysd',  'U.S. District Court, Southern District of New York',  'SDNY',  'federal_district',  'NY', 40.7133, -74.0023, 500,  '40 Foley Square, New York, NY 10007',        null,         '#2563EB'),
('nyed',  'U.S. District Court, Eastern District of New York',   'EDNY',  'federal_district',  'NY', 40.6978, -73.9906, 500,  '225 Cadman Plaza E, Brooklyn, NY 11201',     null,         '#2563EB'),
('nynd',  'U.S. District Court, Northern District of New York',  'NDNY',  'federal_district',  'NY', 42.6511, -73.7540, 500,  '445 Broadway, Albany, NY 12207',             null,         '#2563EB'),
('nywd',  'U.S. District Court, Western District of New York',   'WDNY',  'federal_district',  'NY', 42.8868, -78.8755, 500,  '2 Niagara Square, Buffalo, NY 14202',        null,         '#2563EB'),

-- ── FEDERAL APPELLATE ─────────────────────────────────────────
('ca2',   'U.S. Court of Appeals, Second Circuit',               'CA2',   'federal_appellate', 'NY', 40.7133, -74.0023, 1000, '40 Foley Square, New York, NY 10007',        null,         '#DC2626'),

-- ── FEDERAL BANKRUPTCY ───────────────────────────────────────
('nysb',  'U.S. Bankruptcy Court, Southern District of New York','SDNY Bankr.', 'federal_bankruptcy', 'NY', 40.7038, -74.0132, 500, 'One Bowling Green, New York, NY 10004',  null,         '#9333EA'),
('nyeb',  'U.S. Bankruptcy Court, Eastern District of New York', 'EDNY Bankr.', 'federal_bankruptcy', 'NY', 40.6978, -73.9906, 500, '271-C Cadman Plaza E, Brooklyn, NY 11201', null,       '#9333EA'),
('nynb',  'U.S. Bankruptcy Court, Northern District of New York','NDNY Bankr.', 'federal_bankruptcy', 'NY', 42.6511, -73.7540, 500, '445 Broadway, Albany, NY 12207',          null,       '#9333EA'),
('nywb',  'U.S. Bankruptcy Court, Western District of New York', 'WDNY Bankr.', 'federal_bankruptcy', 'NY', 42.8868, -78.8755, 500, '2 Niagara Square, Buffalo, NY 14202',     null,       '#9333EA'),

-- ── NY STATE APPELLATE ────────────────────────────────────────
('ny',         'New York Court of Appeals',                       'NY Ct App',   'state_appellate', 'NY', 42.6497, -73.7546, 500, '20 Eagle Street, Albany, NY 12207',             null, '#DC2626'),
('nyappdiv1',  'Appellate Division, First Department',           'App Div 1st', 'state_appellate', 'NY', 40.7437, -73.9876, 500, '27 Madison Avenue, New York, NY 10010',         null, '#DC2626'),
('nyappdiv2',  'Appellate Division, Second Department',          'App Div 2nd', 'state_appellate', 'NY', 40.6986, -73.9929, 500, '45 Monroe Place, Brooklyn, NY 11201',           null, '#DC2626'),
('nyappdiv3',  'Appellate Division, Third Department',           'App Div 3rd', 'state_appellate', 'NY', 42.6498, -73.7558, 500, '138 Eagle Street, Albany, NY 12207',            null, '#DC2626'),
('nyappdiv4',  'Appellate Division, Fourth Department',          'App Div 4th', 'state_appellate', 'NY', 43.1566, -77.6090, 500, '50 East Avenue, Rochester, NY 14604',           null, '#DC2626'),

-- ── NY SUPREME COURT — NYC BOROUGHS ──────────────────────────
('nysupct-new-york',   'Supreme Court, New York County',   'NY Sup Ct, NY Co.',    'state_trial', 'NY', 40.7140, -74.0026, 300, '60 Centre Street, New York, NY 10007',            'Manhattan',    '#CA8A04'),
('nysupct-kings',      'Supreme Court, Kings County',      'NY Sup Ct, Kings Co.', 'state_trial', 'NY', 40.6924, -73.9900, 300, '360 Adams Street, Brooklyn, NY 11201',            'Brooklyn',     '#CA8A04'),
('nysupct-queens',     'Supreme Court, Queens County',     'NY Sup Ct, Queens Co.','state_trial', 'NY', 40.7046, -73.7987, 300, '88-11 Sutphin Blvd, Jamaica, NY 11435',           'Queens',       '#CA8A04'),
('nysupct-bronx',      'Supreme Court, Bronx County',      'NY Sup Ct, Bronx Co.', 'state_trial', 'NY', 40.8247, -73.9238, 300, '851 Grand Concourse, Bronx, NY 10451',            'Bronx',        '#CA8A04'),
('nysupct-richmond',   'Supreme Court, Richmond County',   'NY Sup Ct, Rich. Co.', 'state_trial', 'NY', 40.6434, -74.0943, 300, '18 Richmond Terrace, Staten Island, NY 10301',   'Staten Island', '#CA8A04'),

-- ── NY SUPREME COURT — UPSTATE ────────────────────────────────
('nysupct-albany',     'Supreme Court, Albany County',     'NY Sup Ct, Albany Co.','state_trial', 'NY', 42.6498, -73.7548, 300, '16 Eagle Street, Albany, NY 12207',               null, '#CA8A04'),
('nysupct-erie',       'Supreme Court, Erie County',       'NY Sup Ct, Erie Co.',  'state_trial', 'NY', 42.8840, -78.8735, 300, '25 Delaware Avenue, Buffalo, NY 14202',            null, '#CA8A04'),
('nysupct-monroe',     'Supreme Court, Monroe County',     'NY Sup Ct, Monroe Co.','state_trial', 'NY', 43.1566, -77.6088, 300, '99 Exchange Boulevard, Rochester, NY 14614',      null, '#CA8A04'),
('nysupct-onondaga',   'Supreme Court, Onondaga County',   'NY Sup Ct, Onon. Co.', 'state_trial', 'NY', 43.0481, -76.1474, 300, '401 Montgomery Street, Syracuse, NY 13202',       null, '#CA8A04'),
('nysupct-westchester','Supreme Court, Westchester County','NY Sup Ct, West. Co.', 'state_trial', 'NY', 41.0340, -73.7629, 300, '111 Dr. MLK Jr Blvd, White Plains, NY 10601',     null, '#CA8A04'),
('nysupct-suffolk',    'Supreme Court, Suffolk County',    'NY Sup Ct, Suffolk Co.','state_trial','NY', 40.9178, -72.6626, 300, '1 Court Street, Riverhead, NY 11901',              null, '#CA8A04'),
('nysupct-nassau',     'Supreme Court, Nassau County',     'NY Sup Ct, Nassau Co.','state_trial', 'NY', 40.7476, -73.6376, 300, '100 Supreme Court Drive, Mineola, NY 11501',      null, '#CA8A04'),

-- ── NYC HOUSING COURT ─────────────────────────────────────────
('nychousect-new-york', 'Housing Court, New York County',  'NYC Housing Ct, Mnhtn', 'state_housing', 'NY', 40.7137, -74.0024, 300, '111 Centre Street, New York, NY 10013',        'Manhattan',    '#16A34A'),
('nychousect-kings',    'Housing Court, Kings County',     'NYC Housing Ct, Bklyn', 'state_housing', 'NY', 40.6897, -73.9893, 300, '141 Livingston Street, Brooklyn, NY 11201',    'Brooklyn',     '#16A34A'),
('nychousect-queens',   'Housing Court, Queens County',    'NYC Housing Ct, Qns',   'state_housing', 'NY', 40.7039, -73.7985, 300, '89-17 Sutphin Blvd, Jamaica, NY 11435',        'Queens',       '#16A34A'),
('nychousect-bronx',    'Housing Court, Bronx County',     'NYC Housing Ct, Bronx', 'state_housing', 'NY', 40.8374, -73.9240, 300, '1118 Grand Concourse, Bronx, NY 10456',        'Bronx',        '#16A34A'),
('nychousect-richmond', 'Housing Court, Richmond County',  'NYC Housing Ct, S.I.',  'state_housing', 'NY', 40.6267, -74.1183, 300, '927 Castleton Avenue, Staten Island, NY 10310','Staten Island', '#16A34A'),

-- ── NYC CIVIL COURT ───────────────────────────────────────────
('nycivct-new-york', 'Civil Court, City of New York, New York County', 'NYC Civil Ct, Mnhtn', 'state_trial', 'NY', 40.7137, -74.0024, 300, '111 Centre Street, New York, NY 10013',    'Manhattan', '#CA8A04'),
('nycivct-kings',    'Civil Court, City of New York, Kings County',    'NYC Civil Ct, Bklyn', 'state_trial', 'NY', 40.6897, -73.9893, 300, '141 Livingston Street, Brooklyn, NY 11201', 'Brooklyn',  '#CA8A04'),

-- ── NYC CRIMINAL COURT ────────────────────────────────────────
('nycrimct-new-york', 'Criminal Court, City of New York, New York County', 'NYC Crim Ct, Mnhtn', 'state_trial', 'NY', 40.7141, -74.0028, 300, '100 Centre Street, New York, NY 10013',      'Manhattan', '#CA8A04'),
('nycrimct-kings',    'Criminal Court, City of New York, Kings County',    'NYC Crim Ct, Bklyn', 'state_trial', 'NY', 40.6899, -73.9885, 300, '120 Schermerhorn Street, Brooklyn, NY 11201', 'Brooklyn',  '#CA8A04'),

-- ── NYC FAMILY COURT ──────────────────────────────────────────
('nyfamct-new-york', 'Family Court, New York County',  'NYC Fam Ct, Mnhtn', 'state_family', 'NY', 40.7151, -74.0044, 300, '60 Lafayette Street, New York, NY 10013',          'Manhattan',    '#6B7280'),
('nyfamct-kings',    'Family Court, Kings County',     'NYC Fam Ct, Bklyn', 'state_family', 'NY', 40.6940, -73.9907, 300, '330 Jay Street, Brooklyn, NY 11201',                'Brooklyn',     '#6B7280'),
('nyfamct-queens',   'Family Court, Queens County',    'NYC Fam Ct, Qns',   'state_family', 'NY', 40.7007, -73.7972, 300, '151-20 Jamaica Avenue, Jamaica, NY 11432',          'Queens',       '#6B7280'),
('nyfamct-bronx',    'Family Court, Bronx County',     'NYC Fam Ct, Bronx', 'state_family', 'NY', 40.8330, -73.9213, 300, '900 Sheridan Avenue, Bronx, NY 10451',              'Bronx',        '#6B7280'),
('nyfamct-richmond', 'Family Court, Richmond County',  'NYC Fam Ct, S.I.',  'state_family', 'NY', 40.6441, -74.0980, 300, '100 Richmond Terrace, Staten Island, NY 10301',    'Staten Island', '#6B7280'),

-- ── SURROGATE'S COURT ─────────────────────────────────────────
('nysurcr-new-york', 'Surrogate''s Court, New York County',  'Surr. Ct, NY Co.',   'state_surrogate', 'NY', 40.7131, -74.0068, 300, '31 Chambers Street, New York, NY 10007',           'Manhattan',    '#6B7280'),
('nysurcr-kings',    'Surrogate''s Court, Kings County',     'Surr. Ct, Kings Co.','state_surrogate', 'NY', 40.6940, -73.9897, 300, '2 Johnson Street, Brooklyn, NY 11201',             'Brooklyn',     '#6B7280'),
('nysurcr-queens',   'Surrogate''s Court, Queens County',    'Surr. Ct, Qns Co.',  'state_surrogate', 'NY', 40.7046, -73.7987, 300, '88-11 Sutphin Blvd, Jamaica, NY 11435',            'Queens',       '#6B7280'),
('nysurcr-bronx',    'Surrogate''s Court, Bronx County',     'Surr. Ct, Bronx Co.','state_surrogate', 'NY', 40.8247, -73.9238, 300, '851 Grand Concourse, Bronx, NY 10451',             'Bronx',        '#6B7280'),
('nysurcr-richmond', 'Surrogate''s Court, Richmond County',  'Surr. Ct, Rich. Co.','state_surrogate', 'NY', 40.6434, -74.0943, 300, '18 Richmond Terrace, Staten Island, NY 10301',    'Staten Island', '#6B7280'),

-- ── COURT OF CLAIMS ───────────────────────────────────────────
('nyclaimsct', 'New York Court of Claims', 'NY Ct of Claims', 'state_claims', 'NY', 40.7137, -74.0024, 300, '111 Centre Street, New York, NY 10013', null, '#6B7280')

on conflict (cl_court_id) do nothing;
