-- Allow authenticated users to see all of their own products,
-- including inactive/out-of-stock products in "Mes produits".
create policy "users_select_own_products"
  on public.products
  for select
  to authenticated
  using (vendor_id = auth.uid());
