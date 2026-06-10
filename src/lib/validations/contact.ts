import { z } from "zod";

export const contactSchema = z.object({
  nombre: z.string().min(2, "Mínimo 2 caracteres"),
  canal: z.enum(["whatsapp", "email"]),
  contacto: z.string().min(5, "Campo requerido"),
});

export type ContactFormData = z.infer<typeof contactSchema>;
