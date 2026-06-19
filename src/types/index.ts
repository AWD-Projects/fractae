import type { Database } from './database'

export type { TraduccionItem, Traducciones } from './database'

export type Locale = 'es' | 'en' | 'fr'
export type SupportedLocale = Locale

// ── Table Row types (what comes FROM the DB) ──
export type Funcionalidad =
  Database['public']['Tables']['funcionalidades']['Row']

export type Beneficio =
  Database['public']['Tables']['beneficios']['Row']

export type PlanesConfig =
  Database['public']['Tables']['planes_config']['Row']

export type Lead =
  Database['public']['Tables']['leads']['Row']

// ── Insert types ──
export type FuncionalidadInsert =
  Database['public']['Tables']['funcionalidades']['Insert']

export type BeneficioInsert =
  Database['public']['Tables']['beneficios']['Insert']

export type LeadInsert =
  Database['public']['Tables']['leads']['Insert']

// ── Update types ──
export type FuncionalidadUpdate =
  Database['public']['Tables']['funcionalidades']['Update']

export type BeneficioUpdate =
  Database['public']['Tables']['beneficios']['Update']

export type PlanesConfigUpdate =
  Database['public']['Tables']['planes_config']['Update']

export type LeadUpdate =
  Database['public']['Tables']['leads']['Update']

// ── Enums ──
export type CanalTipo  = Database['public']['Enums']['canal_tipo']
export type LeadEstado = Database['public']['Enums']['lead_estado']

// ── UI / Form types ──
export interface ContactFormData {
  nombre:   string
  canal:    CanalTipo
  contacto: string
}

export interface AdminNavItem {
  label:   string
  href:    string
  icon:    string
  active?: boolean
}

// ── Storage ──
export interface UploadResult {
  path:      string
  publicUrl: string
}

// ── API Responses ──
export interface ApiResponse<T = void> {
  data?:   T
  error?:  string
  success: boolean
}
