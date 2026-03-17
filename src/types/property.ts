export type PropertyType =
  | 'casa'
  | 'departamento'
  | 'ph'
  | 'local'
  | 'lote'
  | 'oficina'
  | 'quinta'
  | 'cochera'
  | 'cabaña';

export interface Property {
  id: string;
  title: string;
  description: string | null;
  price: number;
  currency: 'ARS' | 'USD';
  status?: 'available' | 'sold' | 'rented' | 'reserved';
  location: string;
  lat?: number | null;
  lng?: number | null;
  rooms: number;
  bathrooms: number;
  sqft: number;
  type: 'sale' | 'rent';
  property_type: PropertyType;
  featured: boolean;
  image_urls: string[];
  created_at?: string;
  is_visible?: boolean;
  sold_at?: string | null;
}

export interface PropertyFilters {
  search: string;
  type: 'all' | 'sale' | 'rent';
  property_type: PropertyType | 'all';
  minPrice: string;
  maxPrice: string;
  city: string;
}