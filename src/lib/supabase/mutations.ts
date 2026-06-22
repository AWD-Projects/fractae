import { createAdminClient } from '@/lib/supabase/admin'
import { mergeTraduccion } from '@/lib/i18n/resolve-locale'
import { revalidatePath } from 'next/cache'
import type { Json } from '@/types/database'
import type {
  FuncionalidadInsert,
  FuncionalidadUpdate,
  BeneficioInsert,
  BeneficioUpdate,
  PlanesConfigUpdate,
  LeadUpdate,
  TraduccionItem,
} from '@/types'

// ── FUNCIONALIDADES ──────────────────────────────

export async function createFuncionalidad(data: FuncionalidadInsert) {
  const supabase = createAdminClient()
  const { data: created, error } = await supabase
    .from('funcionalidades')
    .insert(data)
    .select()
    .single()
  if (error) throw new Error(error.message)
  revalidatePath('/[locale]', 'layout')
  return created
}

export async function updateFuncionalidad(id: string, data: FuncionalidadUpdate) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('funcionalidades').update(data).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/[locale]', 'layout')
}

export async function updateFuncionalidadTraduccion(
  id: string,
  locale: 'en' | 'fr',
  incoming: TraduccionItem
) {
  const supabase = createAdminClient()

  const { data: row, error: fetchError } = await supabase
    .from('funcionalidades')
    .select('traducciones')
    .eq('id', id)
    .single()

  if (fetchError) throw new Error(fetchError.message)

  const merged = mergeTraduccion(row.traducciones, locale, incoming) as unknown as Json

  const { error } = await supabase
    .from('funcionalidades')
    .update({ traducciones: merged })
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/[locale]', 'layout')
}

export async function deleteFuncionalidad(id: string, imagenPath: string | null) {
  const supabase = createAdminClient()

  if (imagenPath) {
    await supabase.storage.from('feature-images').remove([imagenPath])
  }

  const { error } = await supabase.from('funcionalidades').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/[locale]', 'layout')
}

export async function reorderFuncionalidades(items: { id: string; orden: number }[]) {
  const supabase = createAdminClient()
  await Promise.all(
    items.map(({ id, orden }) =>
      supabase.from('funcionalidades').update({ orden }).eq('id', id)
    )
  )
  revalidatePath('/[locale]', 'layout')
}

// ── STORAGE: FEATURE IMAGES ──────────────────────

export async function uploadFeatureImage(
  id: string,
  file: File
): Promise<{ publicUrl: string; path: string }> {
  const supabase = createAdminClient()
  const ext  = file.name.split('.').pop()
  const path = `${id}/${Date.now()}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('feature-images')
    .upload(path, file, { upsert: true })

  if (uploadError) throw new Error(uploadError.message)

  const { data: { publicUrl } } = supabase.storage
    .from('feature-images')
    .getPublicUrl(path)

  await supabase
    .from('funcionalidades')
    .update({ imagen_url: publicUrl, imagen_path: path })
    .eq('id', id)

  revalidatePath('/[locale]', 'layout')
  return { publicUrl, path }
}

// ── BENEFICIOS ───────────────────────────────────

export async function createBeneficio(data: BeneficioInsert) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('beneficios').insert(data)
  if (error) throw new Error(error.message)
  revalidatePath('/[locale]', 'layout')
}

export async function updateBeneficio(id: string, data: BeneficioUpdate) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('beneficios').update(data).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/[locale]', 'layout')
}

export async function updateBeneficioTraduccion(
  id: string,
  locale: 'en' | 'fr',
  incoming: TraduccionItem
) {
  const supabase = createAdminClient()

  const { data: row, error: fetchError } = await supabase
    .from('beneficios')
    .select('traducciones')
    .eq('id', id)
    .single()

  if (fetchError) throw new Error(fetchError.message)

  const merged = mergeTraduccion(row.traducciones, locale, incoming) as unknown as Json

  const { error } = await supabase
    .from('beneficios')
    .update({ traducciones: merged })
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/[locale]', 'layout')
}

export async function deleteBeneficio(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('beneficios').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/[locale]', 'layout')
}

export async function setDestacadoBeneficio(id: string) {
  const supabase = createAdminClient()
  await supabase.from('beneficios').update({ destacado: false }).neq('id', id)
  const { error } = await supabase.from('beneficios').update({ destacado: true }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/[locale]', 'layout')
}

// ── PLANES CONFIG ─────────────────────────────────

export async function updatePlanesConfig(data: PlanesConfigUpdate) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('planes_config').update(data).not('id', 'is', null)
  if (error) throw new Error(error.message)
  revalidatePath('/[locale]', 'layout')
}

export async function updatePlanesConfigTraduccion(
  locale: 'en' | 'fr',
  incoming: TraduccionItem
) {
  const supabase = createAdminClient()

  const { data: row, error: fetchError } = await supabase
    .from('planes_config')
    .select('traducciones')
    .single()

  if (fetchError) throw new Error(fetchError.message)

  const merged = mergeTraduccion(row.traducciones, locale, incoming) as unknown as Json

  const { error } = await supabase
    .from('planes_config')
    .update({ traducciones: merged })
    .not('id', 'is', null)

  if (error) throw new Error(error.message)
  revalidatePath('/[locale]', 'layout')
}

// ── LEADS ─────────────────────────────────────────

export async function updateLead(id: string, data: LeadUpdate) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('leads').update(data).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/[locale]/admin/leads', 'page')
}

export async function deleteLead(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('leads').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/[locale]/admin/leads', 'page')
}
