create table public.slideshows (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  markdown text not null,
  is_public boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.slideshows enable row level security;

create policy "Users can view their own slideshows"
  on public.slideshows for select
  using (auth.uid() = user_id);

create policy "Users can insert their own slideshows"
  on public.slideshows for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own slideshows"
  on public.slideshows for update
  using (auth.uid() = user_id);

create policy "Users can delete their own slideshows"
  on public.slideshows for delete
  using (auth.uid() = user_id);

create policy "Anyone can view public slideshows"
  on public.slideshows for select
  using (is_public = true);

create index slideshows_user_id_idx on public.slideshows (user_id);
create index slideshows_is_public_idx on public.slideshows (is_public);
