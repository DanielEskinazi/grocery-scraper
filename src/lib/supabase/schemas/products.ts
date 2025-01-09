import { z } from 'zod';

export const productSchema = z.object({
  store_id: z.string().uuid(),
  name: z.string().min(1).max(200),
  description: z.string().max(1000).nullable(),
  category: z.string().min(1),
  unit: z.enum(['piece', 'kg', 'g', 'l', 'ml', 'pack']),
});

export type ProductInput = z.infer<typeof productSchema>;
