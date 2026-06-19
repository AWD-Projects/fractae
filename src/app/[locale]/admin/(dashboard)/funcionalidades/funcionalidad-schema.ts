import { z } from "zod"

export const funcionalidadSchema = z.object({
  titulo: z.string().min(1, "El título es requerido"),
  descripcion: z.string().min(1, "La descripción es requerida"),
  icono: z.string().min(1, "Selecciona un ícono"),
  bullets: z.array(z.object({ value: z.string() })),
  visible: z.boolean(),
})

export type FuncionalidadFormValues = z.infer<typeof funcionalidadSchema>
