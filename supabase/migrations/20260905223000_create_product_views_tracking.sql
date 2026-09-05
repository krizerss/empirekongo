create table if not exists public.product_views (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  viewer_id uuid null references auth.users(id) on delete set null,
  viewed_at timestamptz not null default now()
);

create index if not exists product_views_product_viewed_idx on public.product_views(product_id, viewed_at desc);
create index if not exists product_views_viewer_viewed_idx on public.product_views(viewer_id, viewed_at desc);

alter table public.product_views enable row level security;

drop policy if exists "Anyone can record product views" on public.product_views;
create policy "Anyone can record product views"
  on public.product_views for insert
  with check (true);

drop policy if exists "Product owners can read product views" on public.product_views;
create policy "Product owners can read product views"
  on public.product_views for select
  using (
    exists (
      select 1 from public.products p
      where p.id = product_views.product_id
        and p.vendor_id = auth.uid()
    )
  );
