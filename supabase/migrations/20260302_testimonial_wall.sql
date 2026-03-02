-- Testimonial Wall tables

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  display_name text not null,
  avatar_url text,
  content text not null,
  category text not null default 'general'
    check (category in ('general','bible-study','palace','dojo','games','prayer','growth')),
  is_approved boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_testimonials_user on public.testimonials(user_id);
create index if not exists idx_testimonials_created on public.testimonials(created_at desc);
create index if not exists idx_testimonials_category on public.testimonials(category);

alter table public.testimonials enable row level security;

create policy "Anyone can read approved testimonials"
  on public.testimonials for select
  using (is_approved = true);

create policy "Users can insert their own testimonials"
  on public.testimonials for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own testimonials"
  on public.testimonials for update
  using (auth.uid() = user_id);

create policy "Users can delete their own testimonials"
  on public.testimonials for delete
  using (auth.uid() = user_id);

-- Reactions table
create table if not exists public.testimonial_reactions (
  id uuid primary key default gen_random_uuid(),
  testimonial_id uuid references public.testimonials(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  reaction text not null check (reaction in ('amen','fire','heart','pray')),
  created_at timestamptz not null default now(),
  unique(testimonial_id, user_id, reaction)
);

create index if not exists idx_testimonial_reactions_testimonial on public.testimonial_reactions(testimonial_id);
create index if not exists idx_testimonial_reactions_user on public.testimonial_reactions(user_id);

alter table public.testimonial_reactions enable row level security;

create policy "Anyone can read reactions"
  on public.testimonial_reactions for select
  using (true);

create policy "Users can insert their own reactions"
  on public.testimonial_reactions for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own reactions"
  on public.testimonial_reactions for delete
  using (auth.uid() = user_id);

-- Enable realtime
alter publication supabase_realtime add table public.testimonials;
