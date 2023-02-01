-- postsテーブル作成
create table posts (
  id uuid not null default uuid_generate_v4() primary key,
  name text not null,
  prompt text not null,
  image_url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- postsテーブルRLS設定
alter table posts enable row level security;
create policy "誰でも参照可能" on posts for select using ( true );
create policy "誰でも追加可能" on posts for insert with check ( true );

-- storage作成
insert into storage.buckets (id, name, public) values ('posts', 'posts', true);
create policy "誰でも参照可能" on storage.objects for select using ( bucket_id = 'posts' );
create policy "誰でも追加可能" on storage.objects for insert with check ( bucket_id = 'posts' );
