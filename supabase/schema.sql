create extension if not exists pgcrypto;

create type public.enquiry_status as enum ('New', 'Contacted', 'Qualified', 'Won', 'Closed');

create table public.enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 100),
  email text not null check (char_length(email) <= 254),
  company text check (char_length(company) <= 120),
  service text not null check (char_length(service) <= 100),
  stage text check (char_length(stage) <= 120),
  message text not null check (char_length(message) between 20 and 5000),
  status public.enquiry_status not null default 'New',
  is_read boolean not null default false,
  country text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.enquiry_notes (
  id uuid primary key default gen_random_uuid(),
  enquiry_id uuid not null references public.enquiries(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 3000),
  created_at timestamptz not null default now()
);

create table public.analytics_events (
  id bigint generated always as identity primary key,
  event_name text not null check (event_name in ('page_view','cta_click','contact_click','project_view','enquiry_conversion')),
  page text not null default '/',
  label text,
  session_id text not null,
  referrer text,
  device text,
  browser text,
  country text,
  ip_hash text,
  created_at timestamptz not null default now()
);

create table public.notification_deliveries (
  id uuid primary key default gen_random_uuid(),
  enquiry_id uuid not null references public.enquiries(id) on delete cascade,
  channel text not null check (channel in ('whatsapp','email')),
  status text not null check (status in ('sent','failed')),
  provider_id text,
  error_message text,
  created_at timestamptz not null default now()
);

create index enquiries_created_at_idx on public.enquiries(created_at desc);
create index enquiries_status_idx on public.enquiries(status);
create index analytics_created_at_idx on public.analytics_events(created_at desc);
create index analytics_event_name_idx on public.analytics_events(event_name);
create index analytics_session_idx on public.analytics_events(session_id);
create index analytics_ip_created_idx on public.analytics_events(ip_hash, created_at desc);
create index deliveries_enquiry_idx on public.notification_deliveries(enquiry_id, created_at desc);

alter table public.enquiries enable row level security;
alter table public.enquiry_notes enable row level security;
alter table public.analytics_events enable row level security;
alter table public.notification_deliveries enable row level security;

create policy "admin reads enquiries" on public.enquiries for select to authenticated using ((auth.jwt()->>'email') = 'victoriyoyo2493@gmail.com');
create policy "admin updates enquiries" on public.enquiries for update to authenticated using ((auth.jwt()->>'email') = 'victoriyoyo2493@gmail.com');
create policy "admin manages notes" on public.enquiry_notes for all to authenticated using ((auth.jwt()->>'email') = 'victoriyoyo2493@gmail.com') with check ((auth.jwt()->>'email') = 'victoriyoyo2493@gmail.com');
create policy "admin reads analytics" on public.analytics_events for select to authenticated using ((auth.jwt()->>'email') = 'victoriyoyo2493@gmail.com');
create policy "admin reads deliveries" on public.notification_deliveries for select to authenticated using ((auth.jwt()->>'email') = 'victoriyoyo2493@gmail.com');

create or replace function public.purge_old_analytics() returns void language sql security definer set search_path = public as $$
  delete from public.analytics_events where created_at < now() - interval '12 months';
$$;
