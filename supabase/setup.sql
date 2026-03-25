-- CCTV Inspection App - Supabase setup
-- Run this in Supabase SQL Editor

-- 1) Table
create table if not exists public.cctv_inspections (
  id uuid primary key default gen_random_uuid(),
  page_type text not null check (page_type in ('general_check', 'data_entry')),
  stt integer not null,
  camera_position text not null,
  evidence_image_url text null,
  camera_date date not null,
  note text null,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_cctv_inspections_created_by on public.cctv_inspections(created_by);
create index if not exists idx_cctv_inspections_page_type on public.cctv_inspections(page_type);

-- 2) updated_at trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_cctv_inspections_updated_at on public.cctv_inspections;
create trigger trg_cctv_inspections_updated_at
before update on public.cctv_inspections
for each row
execute function public.set_updated_at();

-- 3) Enable RLS
alter table public.cctv_inspections enable row level security;

-- 4) Policies
create policy if not exists "select own inspections"
on public.cctv_inspections
for select
using (created_by = auth.uid());

create policy if not exists "insert own inspections"
on public.cctv_inspections
for insert
with check (created_by = auth.uid());

create policy if not exists "update own inspections"
on public.cctv_inspections
for update
using (created_by = auth.uid())
with check (created_by = auth.uid());

create policy if not exists "delete own inspections"
on public.cctv_inspections
for delete
using (created_by = auth.uid());

-- 5) Storage bucket
insert into storage.buckets (id, name, public)
values ('cctv-evidence', 'cctv-evidence', true)
on conflict (id) do nothing;

-- 6) Storage policies (public bucket for quick MVP)
create policy if not exists "authenticated users can upload cctv evidence"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'cctv-evidence');

create policy if not exists "authenticated users can update cctv evidence"
on storage.objects
for update
to authenticated
using (bucket_id = 'cctv-evidence')
with check (bucket_id = 'cctv-evidence');

create policy if not exists "authenticated users can delete cctv evidence"
on storage.objects
for delete
to authenticated
using (bucket_id = 'cctv-evidence');

create policy if not exists "public can read cctv evidence"
on storage.objects
for select
to public
using (bucket_id = 'cctv-evidence');
