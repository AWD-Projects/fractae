import type { Traducciones, TraduccionItem, SupportedLocale } from '@/types'
import type { Database } from '@/types/database'

type Funcionalidad = Database['public']['Tables']['funcionalidades']['Row']
type Beneficio     = Database['public']['Tables']['beneficios']['Row']
type PlanesConfig  = Database['public']['Tables']['planes_config']['Row']

function getTraduccion(raw: unknown, locale: SupportedLocale): TraduccionItem | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null
  const map = raw as Record<string, unknown>
  const t = map[locale]
  if (!t || typeof t !== 'object' || Array.isArray(t)) return null
  return t as TraduccionItem
}

function resolveFields<T extends Record<string, unknown>>(
  row: T,
  locale: SupportedLocale,
  fields: (keyof TraduccionItem)[]
): T {
  if (locale === 'es') return row
  const t = getTraduccion(row['traducciones'], locale)
  if (!t) return row

  const overrides: Record<string, unknown> = {}
  for (const field of fields) {
    if (t[field] !== undefined) overrides[field as string] = t[field]
  }
  return { ...row, ...overrides }
}

export function resolveFuncionalidad(row: Funcionalidad, locale: SupportedLocale): Funcionalidad {
  return resolveFields(row as unknown as Record<string, unknown>, locale, [
    'titulo', 'descripcion', 'bullets',
  ]) as unknown as Funcionalidad
}

export function resolveBeneficio(row: Beneficio, locale: SupportedLocale): Beneficio {
  return resolveFields(row as unknown as Record<string, unknown>, locale, [
    'titulo', 'descripcion',
  ]) as unknown as Beneficio
}

export function resolvePlanesConfig(row: PlanesConfig, locale: SupportedLocale): PlanesConfig {
  return resolveFields(row as unknown as Record<string, unknown>, locale, [
    'titulo', 'subtitulo', 'descripcion', 'cta_texto', 'trust_items',
  ]) as unknown as PlanesConfig
}

export function mergeTraduccion(
  current: unknown,
  locale: Exclude<SupportedLocale, 'es'>,
  incoming: TraduccionItem
): Traducciones {
  const base = (current && typeof current === 'object' && !Array.isArray(current))
    ? (current as Record<string, unknown>)
    : {}
  const existing = (base[locale] && typeof base[locale] === 'object' && !Array.isArray(base[locale]))
    ? (base[locale] as Record<string, unknown>)
    : {}
  return {
    ...base,
    [locale]: { ...existing, ...incoming },
  } as Traducciones
}
