import { supabase } from '../client';
import { Database } from '../types';
import { storeSchema } from '../schemas/stores';
import { validate, validatePartial } from '../validation';
import { handleDatabaseError, isSupabaseError } from '../utils/errors';

type Store = Database['public']['Tables']['stores']['Row'];
type NewStore = Database['public']['Tables']['stores']['Insert'];
type UpdateStore = Database['public']['Tables']['stores']['Update'];

export const storesService = {
  async create(store: NewStore) {
    try {
      const validatedData = validate(storeSchema, store);

      const { data, error } = await supabase
        .from('stores')
        .insert(validatedData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      if (isSupabaseError(error)) {
        handleDatabaseError(error);
      }
      throw error;
    }
  },

  async update(id: string, updates: UpdateStore) {
    try {
      const validatedData = validatePartial(storeSchema, updates);

      const { data, error } = await supabase
        .from('stores')
        .update(validatedData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      if (isSupabaseError(error)) {
        handleDatabaseError(error);
      }
      throw error;
    }
  },

  async getById(id: string) {
    try {
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      if (isSupabaseError(error)) {
        handleDatabaseError(error);
      }
      throw error;
    }
  },

  async list(filters?: {
    store_type?: string;
    location?: { latitude: number; longitude: number; radius: number };
  }) {
    try {
      let query = supabase.from('stores').select('*');

      if (filters?.store_type) {
        query = query.eq('store_type', filters.store_type);
      }

      // TODO: Add location-based filtering using PostGIS
      // if (filters?.location) {
      //   const { latitude, longitude, radius } = filters.location;
      //   // Add spatial query here
      // }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    } catch (error) {
      if (isSupabaseError(error)) {
        handleDatabaseError(error);
      }
      throw error;
    }
  },

  async delete(id: string) {
    try {
      const { error } = await supabase
        .from('stores')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      if (isSupabaseError(error)) {
        handleDatabaseError(error);
      }
      throw error;
    }
  },
};
