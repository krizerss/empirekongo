import { createClient } from './client';

export type Profile = {
  id: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  account_type: 'individual' | 'enterprise' | 'supplier' | 'admin';
  avatar_url: string | null;
  city: string | null;
  country: string;
  website: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
};

export type Enterprise = {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  category: string | null;
  description: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  address: string | null;
  city: string | null;
  province: string | null;
  country: string;
  logo_url: string | null;
  verified: boolean;
  created_at: string;
  updated_at: string;
};

export type Product = {
  id: string;
  owner_id: string;
  enterprise_id: string;
  name: string;
  slug: string | null;
  description: string | null;
  category: string;
  sub_category: string | null;
  status: 'Actif' | 'Brouillon' | 'En attente';
  availability: 'Disponible' | 'Rupture' | 'Sur commande';
  main_image_url: string | null;
  views: number;
  created_at: string;
  updated_at: string;
};

export async function getCurrentProfile() {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError) throw authError;
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (error) throw error;
  return { user, profile: data as Profile | null };
}

export async function updateCurrentProfile(values: Partial<Profile>) {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError) throw authError;
  if (!user) throw new Error('Utilisateur non connecté');

  const { data, error } = await supabase
    .from('profiles')
    .update(values)
    .eq('id', user.id)
    .select('*')
    .single();

  if (error) throw error;
  return data as Profile;
}

export async function getMyEnterprises() {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError) throw authError;
  if (!user) return [];

  const { data, error } = await supabase
    .from('enterprises')
    .select('*')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as Enterprise[];
}

export async function getMyProducts() {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError) throw authError;
  if (!user) return [];

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as Product[];
}

export async function createProduct(input: Omit<Product, 'id' | 'owner_id' | 'created_at' | 'updated_at' | 'views'>) {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError) throw authError;
  if (!user) throw new Error('Utilisateur non connecté');

  const { data, error } = await supabase
    .from('products')
    .insert({ ...input, owner_id: user.id })
    .select('*')
    .single();

  if (error) throw error;
  return data as Product;
}

export async function updateProduct(id: string, values: Partial<Product>) {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError) throw authError;
  if (!user) throw new Error('Utilisateur non connecté');

  const { data, error } = await supabase
    .from('products')
    .update(values)
    .eq('id', id)
    .eq('owner_id', user.id)
    .select('*')
    .single();

  if (error) throw error;
  return data as Product;
}

export async function deleteProduct(id: string) {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError) throw authError;
  if (!user) throw new Error('Utilisateur non connecté');

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)
    .eq('owner_id', user.id);

  if (error) throw error;
}
