alter table public.enquiries alter column email drop not null;
alter table public.enquiries drop constraint if exists enquiries_contact_required;
alter table public.enquiries add constraint enquiries_contact_required check (email is not null or phone is not null);
