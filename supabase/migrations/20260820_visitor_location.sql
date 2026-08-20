alter table public.enquiries
  add column if not exists region text,
  add column if not exists city text;

alter table public.analytics_events
  add column if not exists region text,
  add column if not exists city text;

create index if not exists analytics_location_idx on public.analytics_events(country, region, city);
