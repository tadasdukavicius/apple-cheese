import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Įveskite savo vardą').max(80, 'Vardas per ilgas'),
  email: z.string().trim().email('Įveskite teisingą el. pašto adresą'),
  subject: z.string().trim().min(2, 'Įveskite temą').max(120, 'Tema per ilga'),
  message: z
    .string()
    .trim()
    .min(10, 'Žinutė turi būti bent 10 simbolių')
    .max(2000, 'Žinutė per ilga'),
  // Honeypot: real users never see or fill this field
  website: z.string().max(0).optional(),
});

export type ContactFormValues = z.infer<typeof contactSchema>;

// Mirrors the API's order validation so errors show before submitting
export const checkoutSchema = z.object({
  street: z.string().trim().min(1, 'Įveskite gatvę').max(120),
  houseNumber: z.string().trim().min(1, 'Įveskite namo numerį').max(20),
  flat: z.string().trim().max(20).optional(),
  city: z.string().trim().min(1, 'Įveskite miestą').max(80),
  postalCode: z.string().trim().min(3, 'Įveskite pašto kodą').max(12),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9 ()-]{6,20}$/, 'Įveskite teisingą telefono numerį, pvz., +370 600 00000'),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
