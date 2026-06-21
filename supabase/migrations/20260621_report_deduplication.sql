with ranked_reports as (
  select
    id,
    row_number() over (
      partition by reporter_id, target_type, target_id
      order by created_at, id
    ) as duplicate_number
  from public.reports
  where status = 'pending'
)
delete from public.reports
where id in (
  select id
  from ranked_reports
  where duplicate_number > 1
);

create unique index if not exists reports_one_pending_per_user_target
  on public.reports (reporter_id, target_type, target_id)
  where status = 'pending';

drop policy if exists "users read own reports" on public.reports;
create policy "users read own reports"
  on public.reports
  for select
  using (auth.uid() = reporter_id);
