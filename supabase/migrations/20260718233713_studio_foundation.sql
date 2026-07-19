create extension if not exists pgcrypto;

create type public.studio_role as enum ('admin', 'publisher', 'editor');
create type public.studio_document_kind as enum ('draft', 'published');

create table public.studio_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique check (username = lower(username) and username ~ '^[a-z0-9._-]{3,64}$'),
  email text not null unique,
  display_name text,
  role public.studio_role not null default 'editor',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.studio_documents (
  id uuid primary key default gen_random_uuid(),
  kind public.studio_document_kind not null unique,
  document jsonb not null check (jsonb_typeof(document) = 'object' and document ? 'version'),
  lock_version integer not null default 0 check (lock_version >= 0),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

create table public.studio_revisions (
  id uuid primary key default gen_random_uuid(),
  source_document_id uuid not null references public.studio_documents(id) on delete restrict,
  document jsonb not null check (jsonb_typeof(document) = 'object'),
  label text,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id)
);

create table public.studio_assets (
  id uuid primary key default gen_random_uuid(),
  path text not null unique,
  public_url text not null,
  mime_type text not null check (mime_type in ('image/jpeg', 'image/png', 'image/webp')),
  size_bytes bigint not null check (size_bytes > 0 and size_bytes <= 8388608),
  uploaded_by uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);

create table public.studio_audit_events (
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users(id),
  action text not null,
  entity_type text not null,
  entity_id text,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index studio_revisions_created_at_idx on public.studio_revisions (created_at desc);
create index studio_assets_uploaded_by_idx on public.studio_assets (uploaded_by, created_at desc);
create index studio_audit_events_created_at_idx on public.studio_audit_events (created_at desc);

alter table public.studio_profiles enable row level security;
alter table public.studio_documents enable row level security;
alter table public.studio_revisions enable row level security;
alter table public.studio_assets enable row level security;
alter table public.studio_audit_events enable row level security;

create or replace function public.studio_role_for() returns public.studio_role
language sql stable security definer set search_path = public as $$
  select role from public.studio_profiles where id = auth.uid()
$$;

create or replace function public.is_studio_member() returns boolean language sql stable security definer set search_path = public as $$
  select public.studio_role_for() is not null
$$;

create or replace function public.can_publish_studio() returns boolean language sql stable security definer set search_path = public as $$
  select public.studio_role_for() in ('admin', 'publisher')
$$;

create policy "members read own profile" on public.studio_profiles for select to authenticated using (id = auth.uid());
create policy "members read documents" on public.studio_documents for select to authenticated using (public.is_studio_member());
create policy "public reads published document" on public.studio_documents for select to anon, authenticated using (kind = 'published');
create policy "members read revisions" on public.studio_revisions for select to authenticated using (public.is_studio_member());
create policy "members read assets" on public.studio_assets for select to authenticated using (public.is_studio_member());
create policy "members add assets" on public.studio_assets for insert to authenticated with check (public.is_studio_member() and uploaded_by = auth.uid());
create policy "admins read audit events" on public.studio_audit_events for select to authenticated using (public.studio_role_for() = 'admin');

-- Explicit grants are required by Supabase's 2026 Data API behavior; RLS remains authoritative.
grant usage on schema public to anon, authenticated, service_role;
grant select on public.studio_documents to anon;
grant select on public.studio_profiles, public.studio_documents, public.studio_revisions, public.studio_assets to authenticated;
grant insert on public.studio_assets to authenticated;
grant select on public.studio_audit_events to authenticated;
grant all on public.studio_profiles, public.studio_documents, public.studio_revisions, public.studio_assets, public.studio_audit_events to service_role;
grant usage, select on all sequences in schema public to service_role;

create or replace function public.prevent_studio_revision_mutation() returns trigger language plpgsql as $$
begin
  raise exception 'Studio revisions are immutable';
end $$;
create trigger studio_revisions_immutable before update or delete on public.studio_revisions for each row execute function public.prevent_studio_revision_mutation();

create or replace function public.record_studio_audit() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.studio_audit_events(actor_id, action, entity_type, entity_id)
  values (auth.uid(), lower(tg_op), tg_table_name, coalesce(new.id::text, old.id::text));
  return coalesce(new, old);
end $$;
create trigger studio_documents_audit after insert or update on public.studio_documents for each row execute function public.record_studio_audit();

create or replace function public.save_studio_draft(p_document jsonb, p_expected_lock_version integer)
returns public.studio_documents language plpgsql security definer set search_path = public as $$
declare saved public.studio_documents; actor_id uuid := auth.uid();
begin
  if actor_id is null or not coalesce(public.is_studio_member(), false) then raise exception 'not authorized'; end if;
  update public.studio_documents
  set document = p_document, lock_version = lock_version + 1, updated_at = now(), updated_by = actor_id
  where kind = 'draft' and lock_version = p_expected_lock_version
  returning * into saved;
  if found then return saved; end if;
  if p_expected_lock_version = 0 and not exists (select 1 from public.studio_documents where kind = 'draft') then
    insert into public.studio_documents(kind, document, lock_version, updated_by) values ('draft', p_document, 1, actor_id) returning * into saved;
    return saved;
  end if;
  raise exception 'optimistic lock conflict' using errcode = 'P0001';
end $$;

create or replace function public.publish_studio_document(p_expected_lock_version integer)
returns public.studio_documents language plpgsql security definer set search_path = public as $$
declare draft public.studio_documents; published public.studio_documents; actor_id uuid := auth.uid();
begin
  if actor_id is null or not coalesce(public.can_publish_studio(), false) then raise exception 'not authorized'; end if;
  select * into draft from public.studio_documents where kind = 'draft' for update;
  if not found then raise exception 'draft does not exist'; end if;
  if draft.lock_version <> p_expected_lock_version then raise exception 'optimistic lock conflict' using errcode = 'P0001'; end if;
  insert into public.studio_revisions(source_document_id, document, label, created_by) values (draft.id, draft.document, 'Published', actor_id);
  insert into public.studio_documents(kind, document, lock_version, updated_by) values ('published', draft.document, 1, actor_id)
  on conflict (kind) do update set document = excluded.document, lock_version = studio_documents.lock_version + 1, updated_at = now(), updated_by = actor_id returning * into published;
  return published;
end $$;

create or replace function public.restore_studio_revision(p_revision_id uuid, p_expected_lock_version integer)
returns public.studio_documents language plpgsql security definer set search_path = public as $$
declare revision public.studio_revisions; draft public.studio_documents; saved public.studio_documents; actor_id uuid := auth.uid();
begin
  if actor_id is null or not coalesce(public.can_publish_studio(), false) then raise exception 'not authorized'; end if;
  select * into revision from public.studio_revisions where id = p_revision_id;
  if not found then raise exception 'revision not found'; end if;
  select * into draft from public.studio_documents where kind = 'draft' for update;
  if not found or draft.lock_version <> p_expected_lock_version then raise exception 'optimistic lock conflict' using errcode = 'P0001'; end if;
  insert into public.studio_revisions(source_document_id, document, label, created_by) values (draft.id, draft.document, 'Draft before restore', actor_id);
  update public.studio_documents
  set document = revision.document, lock_version = lock_version + 1, updated_at = now(), updated_by = actor_id
  where id = draft.id
  returning * into saved;
  return saved;
end $$;

revoke all on function public.save_studio_draft(jsonb, integer), public.publish_studio_document(integer), public.restore_studio_revision(uuid, integer) from public, anon;
grant execute on function public.save_studio_draft(jsonb, integer), public.publish_studio_document(integer), public.restore_studio_revision(uuid, integer) to authenticated;
revoke all on function public.studio_role_for(), public.is_studio_member(), public.can_publish_studio() from public, anon;
grant execute on function public.studio_role_for(), public.is_studio_member(), public.can_publish_studio() to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('studio-media', 'studio-media', false, 8388608, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy "studio members upload media" on storage.objects for insert to authenticated with check (bucket_id = 'studio-media' and public.is_studio_member() and (storage.foldername(name))[1] = auth.uid()::text);
create policy "studio members read media" on storage.objects for select to authenticated using (bucket_id = 'studio-media' and public.is_studio_member());
create policy "studio members delete own media" on storage.objects for delete to authenticated using (bucket_id = 'studio-media' and public.is_studio_member() and (storage.foldername(name))[1] = auth.uid()::text);
