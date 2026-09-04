-- Complete product management: real enterprise attachment, sub-category and realtime.
-- Applied to the connected Supabase project before committing this migration.

alter table public.products
  add column if not exists enterprise_id uuid references public.enterprises(id) on delete cascade;

alter table public.products
  add column if not exists sub_category text;

update public.products p
set enterprise_id = e.id
from public.enterprises e
where p.enterprise_id is null
  and e.owner_id = p.vendor_id;

create index if not exists products_enterprise_id_idx
  on public.products(enterprise_id);

create index if not exists products_vendor_id_enterprise_id_idx
  on public.products(vendor_id, enterprise_id);

alter publication supabase_realtime add table public.products;
