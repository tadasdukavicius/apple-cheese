import { z } from 'zod';

export const idParamSchema = z.object({ id: z.string().uuid() });
export const variantIdParamSchema = z.object({ variantId: z.string().uuid() });

export const addToCartSchema = z.object({
  variantId: z.string().uuid(),
  quantity: z.number().int().min(1).max(99).default(1),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(1).max(99),
});

export const createOrderSchema = z.object({
  phone: z.string().trim().regex(/^\+?[0-9 ()-]{6,20}$/, 'Neteisingas telefono numeris'),
  shippingAddress: z.object({
    street: z.string().trim().min(1).max(120),
    houseNumber: z.string().trim().min(1).max(20),
    flat: z.string().trim().max(20).optional(),
    city: z.string().trim().min(1).max(80),
    postalCode: z.string().trim().min(3).max(12),
    country: z.literal('Lietuva'),
  }),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(200),
  subject: z.string().trim().min(2).max(120),
  message: z.string().trim().min(10).max(2000),
  website: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const CATEGORIES = ['singles', 'gift_sets'] as const;

export const productQuerySchema = z.object({
  q: z.string().trim().max(60).optional(),
  category: z.enum(CATEGORIES).optional(),
  sort: z.enum(['newest', 'price_asc', 'price_desc', 'name']).default('newest'),
});

export type ProductQuery = z.infer<typeof productQuerySchema>;
export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
