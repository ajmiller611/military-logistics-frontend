/**
 * User validation schemas using Zod.
 *
 * - Defines rules for creating and editing users
 * - Provides type inference for form inputs
 */
import { z } from 'zod';

// Reusable error message for username length validation
const usernameError = {
  message: 'Username must be between 3 and 20 characters',
};

/** Schema for creating a new user */
export const createUserSchema = z
  .object({
    username: z.string().min(3, usernameError).max(20, usernameError),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    confirmPassword: z
      .string()
      .min(8, 'Confirm Password must be at least 8 characters long'),
    email: z.string().email('Invalid email address'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

/** Schema for editing an existing user (password is excluded) */
export const editUserSchema = z.object({
  username: z.string().min(3, usernameError).max(20, usernameError),
  email: z.string().email('Invalid email address'),
});

/** Type inferred from createUserSchema, used for form input */
export type CreateUserInput = z.infer<typeof createUserSchema>;

/** Type inferred from editUserSchema, used for form input */
export type EditUserInput = z.infer<typeof editUserSchema>;
