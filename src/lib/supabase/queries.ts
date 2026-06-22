import { createClient } from '@/lib/supabase/server'
import {
  resolveFuncionalidad,
  resolveBeneficio,
  resolvePlanesConfig,
} from '@/lib/i18n/resolve-locale'
import type { SupportedLocale } from '@/types'

// ── LANDING QUERIES (anon, server components) ──

export async function getFuncionalidades(locale: SupportedLocale) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('funcionalidades')
    .select('*')
    .eq('visible', true)
    .order('orden', { ascending: true })

  if (error) throw new Error(error.message)
  return (data ?? []).map(f => resolveFuncionalidad(f, locale))
}

export async function getBeneficios(locale: SupportedLocale) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('beneficios')
    .select('*')
    .eq('visible', true)
    .order('orden', { ascending: true })

  if (error) throw new Error(error.message)
  return (data ?? []).map(b => resolveBeneficio(b, locale))
}

export async function getPlanesConfig(locale: SupportedLocale) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('planes_config')
    .select('*')
    .single()

  if (error) throw new Error(error.message)
  return resolvePlanesConfig(data, locale)
}

// ── ADMIN QUERIES (authenticated, raw rows with traducciones) ──

export async function getAdminFuncionalidades() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('funcionalidades')
    .select('*')
    .order('orden', { ascending: true })

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function getAdminBeneficios() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('beneficios')
    .select('*')
    .order('orden', { ascending: true })

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function getAdminPlanesConfig() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('planes_config')
    .select('*')
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function getLeads() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}
