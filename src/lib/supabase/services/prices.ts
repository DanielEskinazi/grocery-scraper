import { supabase } from '../client';
import { Database } from '../types';
import { priceSchema } from '../schemas/prices';
import { validate, validatePartial } from '../validation';
import { handleDatabaseError, isSupabaseError } from '../utils/errors';

type Price = Database['public']['Tables']['prices']['Row'];
type NewPrice = Database['public']['Tables']['prices']['Insert'];
type UpdatePrice = Database['public']['Tables']['prices']['Update'];

export const pricesService = {
  async create(price: NewPrice) {
    try {
      const validatedData = validate(priceSchema, price);

      const { data, error } = await supabase
        .from('prices')
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

  async update(id: string, updates: UpdatePrice) {
    try {
      const validatedData = validatePartial(priceSchema, updates);

      const { data, error } = await supabase
        .from('prices')
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

  async getCurrentPrice(productId: string) {
    try {
      const { data, error } = await supabase
        .from('prices')
        .select('*')
        .eq('product_id', productId)
        .lte('valid_from', new Date().toISOString())
        .or(`valid_to.is.null,valid_to.gt.${new Date().toISOString()}`)
        .order('valid_from', { ascending: false })
        .limit(1)
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

  async getPriceHistory(productId: string, startDate?: string, endDate?: string) {
    try {
      let query = supabase
        .from('prices')
        .select('*')
        .eq('product_id', productId)
        .order('valid_from', { ascending: false });

      if (startDate) {
        query = query.gte('valid_from', startDate);
      }

      if (endDate) {
        query = query.lte('valid_to', endDate);
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
};
