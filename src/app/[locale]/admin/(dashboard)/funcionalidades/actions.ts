'use server'

import {
  createFuncionalidad,
  updateFuncionalidad,
  updateFuncionalidadTraduccion,
  deleteFuncionalidad,
  reorderFuncionalidades,
  uploadFeatureImage,
} from '@/lib/supabase/mutations'
import type { FuncionalidadInsert, FuncionalidadUpdate, TraduccionItem } from '@/types'

export async function createFuncionalidadAction(data: FuncionalidadInsert) {
  return createFuncionalidad(data)
}

export async function updateFuncionalidadAction(id: string, data: FuncionalidadUpdate) {
  return updateFuncionalidad(id, data)
}

export async function deleteFuncionalidadAction(id: string, imagenPath: string | null) {
  return deleteFuncionalidad(id, imagenPath)
}

export async function reorderFuncionalidadesAction(items: { id: string; orden: number }[]) {
  return reorderFuncionalidades(items)
}

export async function updateFuncionalidadTraduccionAction(
  id: string,
  locale: 'en' | 'fr',
  data: TraduccionItem
) {
  return updateFuncionalidadTraduccion(id, locale, data)
}

export async function uploadFeatureImageAction(id: string, formData: FormData) {
  const file = formData.get('file') as File
  if (!file) throw new Error('No file provided')
  return uploadFeatureImage(id, file)
}
