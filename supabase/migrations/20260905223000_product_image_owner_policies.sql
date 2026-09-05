drop policy if exists product_images_insert_owner on public.product_images;
create policy product_images_insert_owner on public.product_images for insert to authenticated with check (exists (select 1 from public.products p where p.id = product_id and p.vendor_id = auth.uid()));

drop policy if exists product_images_update_owner on public.product_images;
create policy product_images_update_owner on public.product_images for update to authenticated using (exists (select 1 from public.products p where p.id = product_id and p.vendor_id = auth.uid())) with check (exists (select 1 from public.products p where p.id = product_id and p.vendor_id = auth.uid()));

drop policy if exists product_images_delete_owner on public.product_images;
create policy product_images_delete_owner on public.product_images for delete to authenticated using (exists (select 1 from public.products p where p.id = product_id and p.vendor_id = auth.uid()));
