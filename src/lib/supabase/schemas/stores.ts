import { z } from 'zod';

export const locationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  country: z.string().min(1),
  postal_code: z.string(),
});

export const operatingHoursSchema = z.object({
  monday: z.object({
    open: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    close: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    closed: z.boolean().default(false),
  }),
  tuesday: z.object({
    open: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    close: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    closed: z.boolean().default(false),
  }),
  wednesday: z.object({
    open: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    close: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    closed: z.boolean().default(false),
  }),
  thursday: z.object({
    open: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    close: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    closed: z.boolean().default(false),
  }),
  friday: z.object({
    open: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    close: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    closed: z.boolean().default(false),
  }),
  saturday: z.object({
    open: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    close: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    closed: z.boolean().default(false),
  }),
  sunday: z.object({
    open: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    close: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    closed: z.boolean().default(false),
  }),
});

export const storeSchema = z.object({
  name: z.string().min(1).max(100),
  location: locationSchema,
  store_type: z.enum(['supermarket', 'convenience', 'grocery', 'wholesale']),
  operating_hours: operatingHoursSchema.nullable(),
});

export type StoreInput = z.infer<typeof storeSchema>;
