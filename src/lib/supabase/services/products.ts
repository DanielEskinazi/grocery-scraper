import { supabase } from '../client';
import { Database } from '../types';
import { productSchema } from '../schemas/products';
import { validate, validatePartial } from '../validation';
import { handleDatabaseError, isSupabaseError } from '../utils/errors';

type Product = Database['public']['Tables']['products']['Row'];
type NewProduct = Database['public']['Tables']['products']['Insert'];
type UpdateProduct = Database['public']['Tables']['products']['Update'];

export const productsService = {
  async create(product: NewProduct) {
    try {
      const validatedData = validate(productSchema, product);

      const { data, error } = await supabase
        .from('products')
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

  async update(id: string, updates: UpdateProduct) {
    try {
      const validatedData = validatePartial(productSchema, updates);

      const { data, error } = await supabase
        .from('products')
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
        .from('products')
        .select('*, stores(*)')
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

  async listByStore(storeId: string, filters?: {
    category?: string;
    searchTerm?: string;
  }) {
    try {
      let query = supabase
        .from('products')
        .select('*, stores(*)')
        .eq('store_id', storeId);

      if (filters?.category) {
        query = query.eq('category', filters.category);
      }

      if (filters?.searchTerm) {
        query = query.ilike('name', `%${filters.searchTerm}%`);
      }

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
        .from('products')
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
