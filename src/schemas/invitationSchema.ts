import { z } from 'zod';

/** Schema for validating invitation form data */
export const invitationSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: z.enum(['USER']),
});

export type InvitationFormData = z.infer<typeof invitationSchema>;
