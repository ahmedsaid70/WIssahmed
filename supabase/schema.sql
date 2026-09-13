-- Run this in the Supabase SQL Editor (Project -> SQL Editor -> New query -> Run).
-- Safe to run more than once -- every statement below is idempotent.

-- "photos" is the single source of truth for both the Gallery (Memory Wall)
-- and the Timeline -- they render the same rows two different ways, rather
-- than keeping two separate tables in sync. storage_path/url are optional
-- because a memory doesn't have to have a photo attached.
create table if not exists photos (
  id uuid primary key default gen_random_uuid(),
  storage_path text,
  url text,
  caption text,
  uploaded_by text,
  created_at timestamptz not null default now()
);

-- Memory Wall fields. Safe to re-run, and safe to run against a table that
-- already existed before these columns were added.
alter table photos
  add column if not exists title text,
  add column if not exists date date not null default current_date,
  add column if not exists location text,
  add column if not exists category text,
  add column if not exists favorite boolean not null default false,
  add column if not exists back_message text,
  add column if not exists timeline boolean not null default false,
  add column if not exists exact_date boolean not null default true;

-- storage_path/url used to be required -- drop that constraint now that a
-- memory can be text-only (safe to re-run).
alter table photos alter column storage_path drop not null;
alter table photos alter column url drop not null;

-- One-time migration: fold any existing timeline_entries into photos so
-- nothing is lost. Safe to re-run, and safe on a fresh project that never
-- had a timeline_entries table.
do $$
begin
  if exists (select 1 from information_schema.tables where table_name = 'timeline_entries') then
    insert into photos (id, url, storage_path, caption, title, date, uploaded_by, created_at)
    select id, photo_url, photo_storage_path, description, title, date, created_by, created_at
    from timeline_entries
    where not exists (select 1 from photos where photos.id = timeline_entries.id);
  end if;
end $$;

-- Once you've confirmed your old timeline entries showed up correctly in
-- the Gallery/Timeline, you can drop the now-unused table:
--   drop table if exists timeline_entries;

create table if not exists guestbook_messages (
  id uuid primary key default gen_random_uuid(),
  author text,
  message text not null,
  created_at timestamptz not null default now()
);

-- Singleton row (id is always `true`, so only one row can ever exist) that
-- remembers whether she's already said yes to the proposal, so the full
-- cinematic sequence only plays once.
create table if not exists proposal_status (
  id boolean primary key default true,
  accepted boolean not null default false,
  accepted_at timestamptz
);
insert into proposal_status (id, accepted)
  values (true, false)
  on conflict (id) do nothing;

-- Full event log for the proposal page: one row per visit, per No click,
-- and per Yes click, so you can see exactly when things happened and how
-- many times, not just the latest state.
create table if not exists proposal_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null check (event_type in ('view', 'yes', 'no')),
  created_at timestamptz not null default now()
);

-- What exactly she saw/clicked (e.g. which "No" taunt was showing, or the
-- final Yes label), so the log reads like a story instead of just counts.
alter table proposal_events add column if not exists message text;

-- Who was logged in when the event happened.
alter table proposal_events add column if not exists user_email text;

-- One row per successful login, so you can see who logged in and when.
create table if not exists login_events (
  id uuid primary key default gen_random_uuid(),
  user_email text,
  created_at timestamptz not null default now()
);

-- General page-visit log -- "message" holds the page name, kept generic so
-- any page can log a visit without needing its own dedicated table.
create table if not exists page_visits (
  id uuid primary key default gen_random_uuid(),
  message text not null,
  user_email text,
  created_at timestamptz not null default now()
);

alter table photos enable row level security;
alter table guestbook_messages enable row level security;
alter table proposal_status enable row level security;
alter table proposal_events enable row level security;
alter table login_events enable row level security;
alter table page_visits enable row level security;

-- Policies can't use "if not exists", so each one is dropped first --
-- this makes the whole script safe to run again anytime (e.g. after
-- pulling schema changes), not just once on a brand new project.

drop policy if exists "Authenticated users can read photos" on photos;
create policy "Authenticated users can read photos" on photos
  for select to authenticated using (true);

drop policy if exists "Authenticated users can add photos" on photos;
create policy "Authenticated users can add photos" on photos
  for insert to authenticated with check (true);

drop policy if exists "Authenticated users can update photos" on photos;
create policy "Authenticated users can update photos" on photos
  for update to authenticated using (true) with check (true);

drop policy if exists "Authenticated users can delete photos" on photos;
create policy "Authenticated users can delete photos" on photos
  for delete to authenticated using (true);

drop policy if exists "Authenticated users can read guestbook" on guestbook_messages;
create policy "Authenticated users can read guestbook" on guestbook_messages
  for select to authenticated using (true);

drop policy if exists "Authenticated users can add guestbook messages" on guestbook_messages;
create policy "Authenticated users can add guestbook messages" on guestbook_messages
  for insert to authenticated with check (true);

drop policy if exists "Authenticated users can delete guestbook messages" on guestbook_messages;
create policy "Authenticated users can delete guestbook messages" on guestbook_messages
  for delete to authenticated using (true);

drop policy if exists "Authenticated users can read proposal status" on proposal_status;
create policy "Authenticated users can read proposal status" on proposal_status
  for select to authenticated using (true);

drop policy if exists "Authenticated users can update proposal status" on proposal_status;
create policy "Authenticated users can update proposal status" on proposal_status
  for update to authenticated using (true) with check (true);

drop policy if exists "Authenticated users can read proposal events" on proposal_events;
create policy "Authenticated users can read proposal events" on proposal_events
  for select to authenticated using (true);

drop policy if exists "Authenticated users can add proposal events" on proposal_events;
create policy "Authenticated users can add proposal events" on proposal_events
  for insert to authenticated with check (true);

drop policy if exists "Authenticated users can read login events" on login_events;
create policy "Authenticated users can read login events" on login_events
  for select to authenticated using (true);

drop policy if exists "Authenticated users can add login events" on login_events;
create policy "Authenticated users can add login events" on login_events
  for insert to authenticated with check (true);

drop policy if exists "Authenticated users can read page visits" on page_visits;
create policy "Authenticated users can read page visits" on page_visits
  for select to authenticated using (true);

drop policy if exists "Authenticated users can add page visits" on page_visits;
create policy "Authenticated users can add page visits" on page_visits
  for insert to authenticated with check (true);

-- Before running the policies below: go to Storage -> New bucket -> name it
-- exactly "photos" -> toggle "Public bucket" ON -> Create.

drop policy if exists "Authenticated users can upload photos" on storage.objects;
create policy "Authenticated users can upload photos"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'photos');

drop policy if exists "Authenticated users can delete photos from storage" on storage.objects;
create policy "Authenticated users can delete photos from storage"
  on storage.objects for delete to authenticated
  using (bucket_id = 'photos');

drop policy if exists "Anyone with the link can view photos" on storage.objects;
create policy "Anyone with the link can view photos"
  on storage.objects for select
  using (bucket_id = 'photos');
