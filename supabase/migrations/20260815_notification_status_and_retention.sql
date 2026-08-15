alter table public.notification_deliveries drop constraint if exists notification_deliveries_status_check;
alter table public.notification_deliveries add constraint notification_deliveries_status_check
  check (status in ('queued','sent','delivered','read','failed','undelivered'));

create extension if not exists pg_cron;
select cron.schedule(
  'purge-portfolio-analytics-monthly',
  '20 3 1 * *',
  $$select public.purge_old_analytics();$$
)
where not exists (select 1 from cron.job where jobname = 'purge-portfolio-analytics-monthly');
