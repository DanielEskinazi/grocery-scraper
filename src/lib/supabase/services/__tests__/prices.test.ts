import { pricesService } from '../prices';
import { supabase } from '../../client';
import { ValidationError } from '../../validation';

// Mock Supabase client
jest.mock('../../client', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

describe('pricesService', () => {
  const mockPrice = {
    product_id: '123e4567-e89b-12d3-a456-426614174000',
    price: 9.99,
    currency: 'USD' as const,
    is_sale: false,
    valid_from: new Date().toISOString(),
    valid_to: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a price with valid data', async () => {
      const mockResponse = { data: { ...mockPrice, id: '123' }, error: null };
      const mockSelect = jest.fn().mockResolvedValue(mockResponse);
      const mockInsert = jest.fn(() => ({ select: () => ({ single: mockSelect }) }));
      
      jest.spyOn(supabase, 'from').mockReturnValue({
        insert: mockInsert,
      } as any);

      const result = await pricesService.create(mockPrice);

      expect(result).toEqual(mockResponse.data);
      expect(supabase.from).toHaveBeenCalledWith('prices');
      expect(mockInsert).toHaveBeenCalledWith(mockPrice);
    });

    it('should throw ValidationError for invalid data', async () => {
      const invalidPrice = { ...mockPrice, price: -10 };

      await expect(pricesService.create(invalidPrice)).rejects.toThrow(ValidationError);
    });
  });

  describe('getCurrentPrice', () => {
    it('should get current valid price', async () => {
      const mockResponse = { data: { ...mockPrice, id: '123' }, error: null };
      const mockSingle = jest.fn().mockResolvedValue(mockResponse);
      const mockLimit = jest.fn(() => ({ single: mockSingle }));
      const mockOrder = jest.fn(() => ({ limit: mockLimit }));
      const mockOr = jest.fn(() => ({ order: mockOrder }));
      const mockLte = jest.fn(() => ({ or: mockOr }));
      const mockEq = jest.fn(() => ({ lte: mockLte }));
      const mockSelect = jest.fn(() => ({ eq: mockEq }));
      
      jest.spyOn(supabase, 'from').mockReturnValue({
        select: mockSelect,
      } as any);

      const result = await pricesService.getCurrentPrice(mockPrice.product_id);

      expect(result).toEqual(mockResponse.data);
      expect(supabase.from).toHaveBeenCalledWith('prices');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('product_id', mockPrice.product_id);
    });
  });

  describe('getPriceHistory', () => {
    it('should get price history with date range', async () => {
      const mockResponse = { data: [{ ...mockPrice, id: '123' }], error: null };
      const mockOrder = jest.fn().mockResolvedValue(mockResponse);
      const mockLte = jest.fn(() => ({ order: mockOrder }));
      const mockGte = jest.fn(() => ({ lte: mockLte }));
      const mockEq = jest.fn(() => ({ gte: mockGte }));
      const mockSelect = jest.fn(() => ({ eq: mockEq }));
      
      jest.spyOn(supabase, 'from').mockReturnValue({
        select: mockSelect,
      } as any);

      const startDate = '2025-01-01';
      const endDate = '2025-12-31';
      const result = await pricesService.getPriceHistory(mockPrice.product_id, startDate, endDate);

      expect(result).toEqual(mockResponse.data);
      expect(supabase.from).toHaveBeenCalledWith('prices');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('product_id', mockPrice.product_id);
    });
  });
});