create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  image_url text not null,
  alt_text text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists product_images_product_sort_idx on public.product_images(product_id, sort_order);

create table if not exists public.product_reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  author_id uuid references public.profiles(id) on delete set null,
  rating integer not null check (rating between 1 and 5),
  comment text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists product_reviews_product_created_idx on public.product_reviews(product_id, created_at desc);

alter table public.product_images enable row level security;
alter table public.product_reviews enable row level security;

drop policy if exists product_images_public_read on public.product_images;
create policy product_images_public_read on public.product_images for select using (true);

drop policy if exists product_reviews_public_read on public.product_reviews;
create policy product_reviews_public_read on public.product_reviews for select using (true);

drop policy if exists product_reviews_authenticated_insert on public.product_reviews;
create policy product_reviews_authenticated_insert on public.product_reviews for insert to authenticated with check (author_id = auth.uid());

drop policy if exists product_reviews_own_update on public.product_reviews;
create policy product_reviews_own_update on public.product_reviews for update to authenticated using (author_id = auth.uid()) with check (author_id = auth.uid());
