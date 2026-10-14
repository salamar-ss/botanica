import { z } from "zod";

export const checkoutSchema = z.object({
  firstName: z.string().trim().min(2, "Enter at least 2 characters."),
  lastName: z.string().trim().min(2, "Enter at least 2 characters."),
  email: z.string().trim().email("Enter a valid email address."),
  phone: z.string().trim().min(6, "Enter a valid phone number."),
  address: z.string().trim().min(5, "Enter your street address."),
  city: z.string().trim().min(2, "Enter your city."),
  postalCode: z.string().trim().min(3, "Enter a valid postal code."),
  country: z.string().trim().min(2, "Enter your country."),
  notes: z.string().trim().max(300, "Notes must be 300 characters or less."),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;