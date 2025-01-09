import { z } from 'zod';

const SUPPORTED_CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'] as const;

export const priceSchema = z.object({
  product_id: z.string().uuid(),
  price: z.number().positive(),
  currency: z.enum(SUPPORTED_CURRENCIES).default('USD'),
  is_sale: z.boolean().default(false),
  valid_from: z.string().datetime(),
  valid_to: z.string().datetime().nullable(),
});

export type PriceInput = z.infer<typeof priceSchema>;
