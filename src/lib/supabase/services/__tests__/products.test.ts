import { productsService } from '../products';
import { supabase } from '../../client';
import { ValidationError } from '../../validation';

// Mock Supabase client
jest.mock('../../client', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

describe('productsService', () => {
  const mockProduct = {
    store_id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Test Product',
    description: 'Test Description',
    category: 'groceries',
    unit: 'piece' as const,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a product with valid data', async () => {
      const mockResponse = { data: { ...mockProduct, id: '123' }, error: null };
      const mockSelect = jest.fn().mockResolvedValue(mockResponse);
      const mockInsert = jest.fn(() => ({ select: () => ({ single: mockSelect }) }));
      
      jest.spyOn(supabase, 'from').mockReturnValue({
        insert: mockInsert,
      } as any);

      const result = await productsService.create(mockProduct);

      expect(result).toEqual(mockResponse.data);
      expect(supabase.from).toHaveBeenCalledWith('products');
      expect(mockInsert).toHaveBeenCalledWith(mockProduct);
    });

    it('should throw ValidationError for invalid data', async () => {
      const invalidProduct = { ...mockProduct, unit: 'invalid' };

      await expect(productsService.create(invalidProduct)).rejects.toThrow(ValidationError);
    });
  });

  describe('listByStore', () => {
    it('should list products by store with filters', async () => {
      const mockResponse = { data: [{ ...mockProduct, id: '123' }], error: null };
      const mockSelect = jest.fn().mockResolvedValue(mockResponse);
      const mockEq = jest.fn(() => ({ select: mockSelect }));
      
      jest.spyOn(supabase, 'from').mockReturnValue({
        select: () => ({ eq: mockEq }),
      } as any);

      const filters = { category: 'groceries', searchTerm: 'test' };
      const result = await productsService.listByStore(mockProduct.store_id, filters);

      expect(result).toEqual(mockResponse.data);
      expect(supabase.from).toHaveBeenCalledWith('products');
      expect(mockEq).toHaveBeenCalledWith('store_id', mockProduct.store_id);
    });
  });

  // Add more test cases for other methods
});