create table if not exists public.trip_plans (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by text
);

create table if not exists public.trip_plan_versions (
  id uuid primary key default gen_random_uuid(),
  trip_id text not null,
  data jsonb not null,
  reason text,
  created_at timestamptz not null default now(),
  created_by text
);

alter table public.trip_plans replica identity full;

alter table public.trip_plans enable row level security;
alter table public.trip_plan_versions enable row level security;

drop policy if exists "trip_plans_read_all" on public.trip_plans;
create policy "trip_plans_read_all"
on public.trip_plans
for select
to anon
using (true);

drop policy if exists "trip_plans_insert_all" on public.trip_plans;
create policy "trip_plans_insert_all"
on public.trip_plans
for insert
to anon
with check (true);

drop policy if exists "trip_plans_update_all" on public.trip_plans;
create policy "trip_plans_update_all"
on public.trip_plans
for update
to anon
using (true)
with check (true);

drop policy if exists "trip_plan_versions_read_all" on public.trip_plan_versions;
create policy "trip_plan_versions_read_all"
on public.trip_plan_versions
for select
to anon
using (true);

drop policy if exists "trip_plan_versions_insert_all" on public.trip_plan_versions;
create policy "trip_plan_versions_insert_all"
on public.trip_plan_versions
for insert
to anon
with check (true);

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'trip_plans'
  ) then
    alter publication supabase_realtime add table public.trip_plans;
  end if;
end
$$;
