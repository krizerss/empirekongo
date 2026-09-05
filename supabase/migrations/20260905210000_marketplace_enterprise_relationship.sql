create or replace function public.enterprise_id(public.products)
returns setof public.enterprises
rows 1
stable
language sql
as $$
  select e.*
  from public.enterprises e
  where e.id = $1.enterprise_id;
$$;

grant execute on function public.enterprise_id(public.products) to authenticated, anon;
