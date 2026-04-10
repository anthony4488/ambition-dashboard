-- Ambition SP Business Dashboard Schema
-- Migration for: ambition_athletes, ambition_sessions, ambition_session_athletes, ambition_leads

-- ============================================================
-- Updated-at trigger function
-- ============================================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ============================================================
-- 1. ambition_athletes
-- ============================================================
create table public.ambition_athletes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  rate integer default 100,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.ambition_athletes enable row level security;

create policy "anon_select_ambition_athletes" on public.ambition_athletes
  for select to anon using (true);
create policy "anon_insert_ambition_athletes" on public.ambition_athletes
  for insert to anon with check (true);
create policy "anon_update_ambition_athletes" on public.ambition_athletes
  for update to anon using (true) with check (true);
create policy "anon_delete_ambition_athletes" on public.ambition_athletes
  for delete to anon using (true);

create trigger set_ambition_athletes_updated_at
  before update on public.ambition_athletes
  for each row execute function public.handle_updated_at();

-- ============================================================
-- 2. ambition_sessions
-- ============================================================
create table public.ambition_sessions (
  id uuid primary key default gen_random_uuid(),
  day_of_week text not null,
  time_slot text not null,
  max_spots integer default 6,
  is_available boolean default false,
  note text,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.ambition_sessions enable row level security;

create policy "anon_select_ambition_sessions" on public.ambition_sessions
  for select to anon using (true);
create policy "anon_insert_ambition_sessions" on public.ambition_sessions
  for insert to anon with check (true);
create policy "anon_update_ambition_sessions" on public.ambition_sessions
  for update to anon using (true) with check (true);
create policy "anon_delete_ambition_sessions" on public.ambition_sessions
  for delete to anon using (true);

create trigger set_ambition_sessions_updated_at
  before update on public.ambition_sessions
  for each row execute function public.handle_updated_at();

create index idx_ambition_sessions_day_of_week on public.ambition_sessions (day_of_week);

-- ============================================================
-- 3. ambition_session_athletes (junction)
-- ============================================================
create table public.ambition_session_athletes (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.ambition_sessions (id) on delete cascade,
  athlete_id uuid not null references public.ambition_athletes (id) on delete cascade,
  created_at timestamptz default now(),
  unique (session_id, athlete_id)
);

alter table public.ambition_session_athletes enable row level security;

create policy "anon_select_ambition_session_athletes" on public.ambition_session_athletes
  for select to anon using (true);
create policy "anon_insert_ambition_session_athletes" on public.ambition_session_athletes
  for insert to anon with check (true);
create policy "anon_update_ambition_session_athletes" on public.ambition_session_athletes
  for update to anon using (true) with check (true);
create policy "anon_delete_ambition_session_athletes" on public.ambition_session_athletes
  for delete to anon using (true);

-- ============================================================
-- 4. ambition_leads
-- ============================================================
create table public.ambition_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  note text,
  status text default 'new',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.ambition_leads enable row level security;

create policy "anon_select_ambition_leads" on public.ambition_leads
  for select to anon using (true);
create policy "anon_insert_ambition_leads" on public.ambition_leads
  for insert to anon with check (true);
create policy "anon_update_ambition_leads" on public.ambition_leads
  for update to anon using (true) with check (true);
create policy "anon_delete_ambition_leads" on public.ambition_leads
  for delete to anon using (true);

create trigger set_ambition_leads_updated_at
  before update on public.ambition_leads
  for each row execute function public.handle_updated_at();

create index idx_ambition_leads_status on public.ambition_leads (status);
