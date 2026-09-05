create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references public.profiles(id) on delete cascade,
  seller_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  quantity integer not null default 1 check (quantity > 0),
  note text not null default '',
  status text not null default 'pending' check (status in ('pending','confirmed','cancelled','completed','expired')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists reservations_buyer_id_idx on public.reservations(buyer_id);
create index if not exists reservations_seller_id_idx on public.reservations(seller_id);
create index if not exists reservations_product_id_idx on public.reservations(product_id);
create index if not exists reservations_status_idx on public.reservations(status);

alter table public.reservations enable row level security;

drop policy if exists buyers_create_reservations on public.reservations;
create policy buyers_create_reservations on public.reservations for insert to authenticated with check ((select auth.uid()) = buyer_id);

drop policy if exists buyers_view_own_reservations on public.reservations;
create policy buyers_view_own_reservations on public.reservations for select to authenticated using ((select auth.uid()) = buyer_id);

drop policy if exists buyers_update_own_reservations on public.reservations;
create policy buyers_update_own_reservations on public.reservations for update to authenticated using ((select auth.uid()) = buyer_id) with check ((select auth.uid()) = buyer_id);

drop policy if exists sellers_view_own_reservations on public.reservations;
create policy sellers_view_own_reservations on public.reservations for select to authenticated using ((select auth.uid()) = seller_id);

drop policy if exists sellers_update_own_reservations on public.reservations;
create policy sellers_update_own_reservations on public.reservations for update to authenticated using ((select auth.uid()) = seller_id) with check ((select auth.uid()) = seller_id);

grant select, insert, update on public.reservations to authenticated;
