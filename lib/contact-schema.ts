import { z } from "zod";

export const ContactSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters.")
    .max(100, "Name must be under 100 characters.")
    .regex(/^[\p{L}\p{M}\s'\-\.]+$/u, "Name contains invalid characters."),
  email: z
    .string()
    .email("Please enter a valid email address.")
    .max(254, "Email address is too long."),
  subject: z
    .string()
    .min(2, "Subject must be at least 2 characters.")
    .max(200, "Subject must be under 200 characters."),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters.")
    .max(5000, "Message must be under 5000 characters."),
  website: z.string().max(0).optional(),
  _trap: z.string().max(0).optional(),
});

export type ContactInput = z.infer<typeof ContactSchema>;
