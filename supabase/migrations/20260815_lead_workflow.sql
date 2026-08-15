alter table public.enquiries
  add column if not exists phone text check (char_length(phone) <= 30),
  add column if not exists preferred_contact text not null default 'Email' check (preferred_contact in ('Email','WhatsApp','Phone')),
  add column if not exists priority text not null default 'Normal' check (priority in ('Low','Normal','High','Urgent')),
  add column if not exists follow_up_at timestamptz,
  add column if not exists tags text[] not null default '{}';

create index if not exists enquiries_follow_up_idx on public.enquiries(follow_up_at) where follow_up_at is not null;
create index if not exists enquiries_priority_idx on public.enquiries(priority);
