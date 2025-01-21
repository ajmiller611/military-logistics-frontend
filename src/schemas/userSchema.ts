import { z } from 'zod';

const usernameError = {
  message: 'Username must be between 3 and 20 characters',
};

export const userSchema = z.object({
  username: z.string().min(3, usernameError).max(20, usernameError),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  email: z.string().email('Invalid email address'),
});

export type UserInput = z.infer<typeof userSchema>;
