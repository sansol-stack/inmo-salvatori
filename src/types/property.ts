export interface Property {
  id: string;
  title: string;
  description: string | null;
  price: number;
  currency: 'ARS' | 'USD';
  status?: 'available' | 'sold' | 'rented' | 'reserved';
  location: string;
  lat?: number | null; // Añade esta línea
  lng?: number | null; // Añade esta línea
  rooms: number;
  bathrooms: number;
  sqft: number;
  type: 'sale' | 'rent';
  featured: boolean;
  image_urls: string[];
  created_at?: string;
  is_visible?: boolean; // Añade esta línea
  sold_at?: string | null; // Añade esta línea
}

export interface PropertyFilters {
  search: string;
  type: 'all' | 'sale' | 'rent';
  minPrice: string;
  maxPrice: string;
  city: string;
}
