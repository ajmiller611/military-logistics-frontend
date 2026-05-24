/**
 * Item validation schema using Zod.
 *
 * - Defines rules for creating inventory items
 * - Provides type inference for form inputs
 */
import { z } from 'zod';

/** Schema for creating a new inventory item */
export const createItemSchema = z.object({
  itemName: z.string().min(1, 'Name is required'),
  quantity: z.number().min(0, 'Quantity cannot be negative'),
  description: z.string().optional(),
});

/** Type inferred from createItemSchema, used for form input */
export type CreateItemFormData = z.infer<typeof createItemSchema>;
