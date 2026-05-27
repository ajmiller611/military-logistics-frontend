/**
 * Item validation schema using Zod.
 *
 * - Defines rules for inventory items
 * - Provides type inference for form inputs
 */
import { z } from 'zod';

/** Schema for a new inventory item */
export const itemSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(50, 'Name must be 50 characters or less'),
  quantity: z.number().min(0, 'Quantity cannot be negative'),
  description: z
    .string()
    .max(1000, 'Description must be 1000 characters or less')
    .optional(),
});

/** Type inferred from itemSchema, used for form input */
export type ItemFormData = z.infer<typeof itemSchema>;
