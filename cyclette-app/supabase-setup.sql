-- Cyclette: one table for all your entries. Run once in Supabase → SQL Editor.
create table if not exists public.entries (
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  key text not null,
  data jsonb not null default '{}'::jsonb,
  updated_at bigint not null,
  deleted boolean not null default false,
  primary key (user_id, key)
);
alter table public.entries enable row level security;
drop policy if exists "Only you can see and change your entries" on public.entries;
create policy "Only you can see and change your entries" on public.entries
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
grant select, insert, update, delete on public.entries to authenticated;
