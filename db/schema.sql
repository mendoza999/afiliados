-- elijemejor.shop — schema Postgres (VPS)
-- 1 DB, 4 tablas. Sin ORM, sin migraciones.
create table if not exists countries(
  code text primary key,           -- 'es'
  marketplace text not null,        -- 'www.amazon.es'
  partner_tag text not null,        -- 'tecnologiaspe-21'
  host text not null default '',    -- Creators API host (cuando haya keys)
  region text not null default '',
  active boolean not null default true
);

create table if not exists categories(
  slug text primary key,
  country text not null references countries(code),
  name text not null,
  keyword text not null,            -- búsqueda Creators API / referencia manual
  unique(country, slug)
);

create table if not exists products(
  asin text primary key,            -- B0XXXXXXX (10 chars)
  title text not null,
  brand text not null default '',
  image text not null default '',   -- URL imagen amazon (hotlink permitido)
  detail_url text not null default '',
  rating numeric(2,1),
  reviews_count integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists rankings(
  country text not null references countries(code),
  category_slug text not null,
  tipo text not null check (tipo in ('bestseller','top-rated')),
  posicion smallint not null check (posicion between 1 and 5),
  asin text not null references products(asin) on delete cascade,
  precio numeric(10,2),
  moneda text not null default 'EUR',
  source text not null default 'manual' check (source in ('manual','api')),
  fecha date not null default current_date,
  primary key (country, category_slug, tipo, posicion, fecha)
);
create index if not exists idx_rankings_latest on rankings(country, category_slug, tipo, fecha desc);

-- Seed mínimo
insert into countries(code, marketplace, partner_tag) values
  ('es','www.amazon.es','tecnologiaspe-21')
on conflict (code) do update set partner_tag=excluded.partner_tag;
