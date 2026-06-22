'use server'

import {
  updatePlanesConfig,
  updatePlanesConfigTraduccion,
} from '@/lib/supabase/mutations'
import type { PlanesConfigUpdate, TraduccionItem } from '@/types'

export async function updatePlanesConfigAction(data: PlanesConfigUpdate) {
  return updatePlanesConfig(data)
}

export async function updatePlanesConfigTraduccionAction(
  locale: 'en' | 'fr',
  data: TraduccionItem
) {
  return updatePlanesConfigTraduccion(locale, data)
}
