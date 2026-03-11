import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Property } from '@/types/property';

export function useProperties(filters?: {
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  city?: string;
  search?: string;
  featured?: boolean;
  isAdmin?: boolean; // Nueva bandera para ver todo en el panel
}) {
  return useQuery({
    queryKey: ['properties', filters],
    queryFn: async () => {
      // 1. Filtro base: Solo mostrar visibles a menos que sea el Admin
      let query: any = supabase
        .from('properties')
        .select('*');

      if (!filters?.isAdmin) {
        query = query.eq('is_visible', true);
      }

      // 2. Ordenamiento inteligente: 
      // Por defecto Supabase ordena alfabéticamente el ENUM:
      // 'available' (A) -> 'reserved' (R) -> 'sold' (S). ¡Nos sirve perfecto!
      query = query
        .order('status', { ascending: true }) 
        .order('created_at', { ascending: false });

      // 3. Filtros existentes
      if (filters?.type && filters.type !== 'all') {
        query = query.eq('type', filters.type);
      }
      if (filters?.minPrice) {
        query = query.gte('price', filters.minPrice);
      }
      if (filters?.maxPrice) {
        query = query.lte('price', filters.maxPrice);
      }
      if (filters?.city) {
        query = query.ilike('location', `%${filters.city}%`);
      }
      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,location.ilike.%${filters.search}%`);
      }
      if (filters?.featured) {
        query = query.eq('featured', true);
      }

      const { data, error } = await query;
      if (error) throw error;

      // 4. Lógica de limpieza automática (Frontend)
      // Si el status es 'sold', verificamos que no hayan pasado más de 30 días
      if (!filters?.isAdmin && data) {
        return data.filter((p: Property) => {
          if (p.status !== 'sold' || !p.sold_at) return true;
          
          const soldDate = new Date(p.sold_at);
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          
          return soldDate > thirtyDaysAgo;
        }) as Property[];
      }

      return data as Property[];
    },
  });
}

export function useProperty(id: string) {
  return useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('properties').select('*').eq('id', id).single();
      if (error) throw error;
      return data as Property;
    },
    enabled: !!id,
  });
}

export function useCreateProperty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (property: Omit<Property, 'id' | 'created_at'>) => {
      const { data, error } = await supabase.from('properties').insert(property).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['properties'] }),
  });
}

export function useUpdateProperty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...property }: Partial<Property> & { id: string }) => {
      // Si el status cambia a 'sold', seteamos sold_at automáticamente
      const updatePayload = { ...property };
      if (property.status === 'sold' && !property.sold_at) {
        updatePayload.sold_at = new Date().toISOString();
      } else if (property.status === 'available') {
        updatePayload.sold_at = null; // Limpiamos la fecha si vuelve a estar disponible
      }

      const { data, error } = await supabase
        .from('properties')
        .update(updatePayload)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['properties'] });
      qc.invalidateQueries({ queryKey: ['property'] });
    },
  });
}

export function useDeleteProperty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('properties').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['properties'] }),
  });
}