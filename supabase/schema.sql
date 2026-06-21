create extension if not exists pgcrypto;

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  bio text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);

create table if not exists site_settings (
  id boolean primary key default true check (id = true),
  allow_registration boolean not null default true,
  public_community_enabled boolean not null default true,
  moderate_new_prayers boolean not null default false,
  community_page_size integer not null default 8 check (community_page_size between 4 and 30),
  support_email text,
  api_enabled boolean not null default true,
  api_maintenance boolean not null default false,
  api_maintenance_message text not null default 'API đang bảo trì. Vui lòng thử lại sau.',
  api_allowed_origins text[] not null default array['*']::text[],
  api_rate_limit_per_minute integer not null default 120 check (api_rate_limit_per_minute between 10 and 5000),
  updated_at timestamptz default now(),
  updated_by uuid references auth.users(id) on delete set null
);

create table if not exists api_rate_limits (
  identifier text not null,
  window_start timestamptz not null,
  request_count integer not null default 1,
  primary key (identifier, window_start)
);

create table if not exists daily_messages (
  id uuid primary key default gen_random_uuid(),
  message text not null,
  reflection_question text,
  category text not null,
  active_date date unique,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists user_daily_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  message_id uuid references daily_messages(id) on delete cascade,
  opened_date date not null,
  created_at timestamptz default now(),
  unique(user_id, opened_date)
);

create table if not exists prayers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  content text not null,
  type text not null check (type in ('wish', 'gratitude', 'memorial', 'worry', 'peace')),
  visibility text not null default 'public_anonymous' check (visibility in ('private', 'public_anonymous')),
  allow_reactions boolean default true,
  status text default 'active' check (status in ('active', 'hidden', 'deleted')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists prayer_reactions (
  id uuid primary key default gen_random_uuid(),
  prayer_id uuid references prayers(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  reaction_type text not null check (reaction_type in ('pray', 'peace', 'candle')),
  created_at timestamptz default now(),
  unique(prayer_id, user_id, reaction_type)
);

create table if not exists future_letters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  content text not null,
  open_at timestamptz not null,
  opened_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists memorials (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  relationship text,
  birth_date date,
  death_date date,
  avatar_url text,
  message text,
  visibility text default 'private' check (visibility in ('private', 'public_link')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists memorial_candles (
  id uuid primary key default gen_random_uuid(),
  memorial_id uuid references memorials(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  message text,
  created_at timestamptz default now()
);

create table if not exists gratitude_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  content text not null,
  entry_date date not null default current_date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references auth.users(id) on delete set null,
  target_type text not null,
  target_id uuid not null,
  reason text not null,
  status text default 'pending',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create unique index if not exists reports_one_pending_per_user_target
  on reports (reporter_id, target_type, target_id)
  where status = 'pending';

alter table profiles enable row level security;
alter table admin_users enable row level security;
alter table site_settings enable row level security;
alter table api_rate_limits enable row level security;
alter table daily_messages enable row level security;
alter table user_daily_messages enable row level security;
alter table prayers enable row level security;
alter table prayer_reactions enable row level security;
alter table future_letters enable row level security;
alter table memorials enable row level security;
alter table memorial_candles enable row level security;
alter table gratitude_entries enable row level security;
alter table reports enable row level security;

create policy "profiles are public" on profiles for select using (true);
create policy "users update own profile" on profiles for update using (auth.uid() = id);
create policy "users insert own profile" on profiles for insert with check (auth.uid() = id);

insert into admin_users (user_id)
select id
from auth.users
where not exists (select 1 from admin_users)
order by created_at
limit 1
on conflict do nothing;

insert into site_settings (id)
values (true)
on conflict do nothing;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars',
  'avatars',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "public reads avatars" on storage.objects
  for select using (bucket_id = 'avatars');

create policy "users upload own avatar" on storage.objects
  for insert with check (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "users update own avatar" on storage.objects
  for update using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "users delete own avatar" on storage.objects
  for delete using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "active daily messages are readable" on daily_messages for select using (is_active = true);

create policy "users read own daily opens" on user_daily_messages for select using (auth.uid() = user_id);
create policy "users insert own daily opens" on user_daily_messages for insert with check (auth.uid() = user_id);

create policy "public reads active prayers" on prayers
  for select using (visibility = 'public_anonymous' and status = 'active');
create policy "users read own prayers" on prayers for select using (auth.uid() = user_id);
create policy "users insert own prayers" on prayers for insert with check (auth.uid() = user_id);
create policy "users update own prayers" on prayers for update using (auth.uid() = user_id);

create policy "reactions are readable" on prayer_reactions for select using (true);
create policy "users insert own reactions" on prayer_reactions for insert with check (auth.uid() = user_id);
create policy "users delete own reactions" on prayer_reactions for delete using (auth.uid() = user_id);

create policy "users manage own letters" on future_letters for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "users read own memorials" on memorials for select using (auth.uid() = user_id);
create policy "public reads linked memorials" on memorials for select using (visibility = 'public_link');
create policy "users insert own memorials" on memorials for insert with check (auth.uid() = user_id);
create policy "users update own memorials" on memorials for update using (auth.uid() = user_id);
create policy "users delete own memorials" on memorials for delete using (auth.uid() = user_id);

create policy "candles are readable for visible memorials" on memorial_candles for select using (
  exists (
    select 1 from memorials
    where memorials.id = memorial_candles.memorial_id
      and (memorials.visibility = 'public_link' or memorials.user_id = auth.uid())
  )
);
create policy "users can light candles" on memorial_candles for insert with check (auth.uid() = user_id or user_id is null);

create policy "users manage own gratitude" on gratitude_entries for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users read own reports" on reports for select using (auth.uid() = reporter_id);
create policy "users create reports" on reports for insert with check (auth.uid() = reporter_id);

insert into daily_messages (message, reflection_question, category, active_date)
values
  ('Có những điều không cần vội vàng. Hôm nay, hãy cho bản thân được thở chậm lại một chút.', 'Hôm nay bạn muốn buông bỏ điều gì?', 'peace', current_date),
  ('Bạn đã cố gắng nhiều hơn bạn nghĩ. Hãy dịu dàng với chính mình hôm nay.', 'Điều nào trong bạn đang cần được công nhận?', 'hope', null),
  ('Không phải ngày nào cũng phải thật mạnh mẽ. Có ngày chỉ cần bình an là đủ.', 'Bạn cần nghỉ ngơi ở đâu?', 'peace', null),
  ('Một ngày mới không cần hoàn hảo, chỉ cần có một điều tốt đẹp.', 'Điều tốt đẹp nhỏ nào đang ở gần bạn?', 'gratitude', null)
on conflict do nothing;
