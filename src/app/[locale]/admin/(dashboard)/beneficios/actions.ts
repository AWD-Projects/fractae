'use server'

import {
  createBeneficio,
  updateBeneficio,
  updateBeneficioTraduccion,
  deleteBeneficio,
} from '@/lib/supabase/mutations'
import type { BeneficioInsert, BeneficioUpdate, TraduccionItem } from '@/types'

export async function createBeneficioAction(data: BeneficioInsert) {
  return createBeneficio(data)
}

export async function updateBeneficioAction(id: string, data: BeneficioUpdate) {
  return updateBeneficio(id, data)
}

export async function updateBeneficioTraduccionAction(
  id: string,
  locale: 'en' | 'fr',
  data: TraduccionItem
) {
  return updateBeneficioTraduccion(id, locale, data)
}

export async function deleteBeneficioAction(id: string) {
  return deleteBeneficio(id)
}
