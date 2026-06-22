import { z } from "zod"

export const beneficioSchema = z.object({
  titulo: z.string().min(1, "El título es requerido"),
  descripcion: z.string().min(1, "La descripción es requerida"),
  icono: z.string().min(1, "Selecciona un ícono"),
  visible: z.boolean(),
})

export type BeneficioFormValues = z.infer<typeof beneficioSchema>
